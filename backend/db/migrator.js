require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const { logger } = require('../config/logger');

class DatabaseMigrator {
  constructor() {
    this.connection = null;
    this.migrationsTable = 'migrations';
    this.migrationsDir = path.join(__dirname, 'migrations');
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.HOST || 'localhost',
        user: process.env.USER || 'root',
        password: process.env.PASSWORD || '',
        database: process.env.DATABASE || 'event_management',
      });
      logger.info('Database connected for migrations');
    } catch (error) {
      logger.error('Database connection failed', { error: error.message });
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      logger.info('Database connection closed');
    }
  }

  async init() {
    // Create migrations table if it doesn't exist
    await this.connection.query(`
      CREATE TABLE IF NOT EXISTS ${this.migrationsTable} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    logger.info('Migrations table initialized');
  }

  async getExecutedMigrations() {
    const [rows] = await this.connection.query(
      `SELECT name FROM ${this.migrationsTable} ORDER BY id`
    );
    return rows.map(row => row.name);
  }

  async executeMigration(name, migrationFn) {
    const executed = await this.getExecutedMigrations();
    
    if (executed.includes(name)) {
      logger.info(`Migration ${name} already executed, skipping`);
      return false;
    }

    logger.info(`Executing migration: ${name}`);
    
    try {
      // Start transaction
      await this.connection.beginTransaction();
      
      // Execute migration
      await migrationFn(this.connection);
      
      // Record migration
      await this.connection.query(
        `INSERT INTO ${this.migrationsTable} (name) VALUES (?)`,
        [name]
      );
      
      // Commit transaction
      await this.connection.commit();
      
      logger.info(`Migration ${name} completed successfully`);
      return true;
    } catch (error) {
      // Rollback on error
      await this.connection.rollback();
      logger.error(`Migration ${name} failed`, { error: error.message });
      throw error;
    }
  }

  async run() {
    await this.connect();
    await this.init();

    // Get all migration files
    const files = fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();

    logger.info(`Found ${files.length} migration files`);

    let executed = 0;
    for (const file of files) {
      const migration = require(path.join(this.migrationsDir, file));
      const result = await this.executeMigration(file, migration.up);
      if (result) executed++;
    }

    logger.info(`Executed ${executed} new migrations`);
    await this.disconnect();
  }

  async status() {
    await this.connect();
    await this.init();

    const executed = await this.getExecutedMigrations();
    const files = fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();

    console.log('\nMigration Status:');
    console.log('=================\n');
    
    for (const file of files) {
      const status = executed.includes(file) ? '✅ Executed' : '⏳ Pending';
      const date = executed.includes(file) 
        ? await this.getExecutionDate(file)
        : '-';
      console.log(`${status} | ${file} | ${date}`);
    }
    console.log();

    await this.disconnect();
  }

  async getExecutionDate(name) {
    const [rows] = await this.connection.query(
      `SELECT executed_at FROM ${this.migrationsTable} WHERE name = ?`,
      [name]
    );
    return rows.length > 0 ? rows[0].executed_at.toISOString() : '-';
  }

  async rollback(lastN = 1) {
    await this.connect();
    await this.init();

    const executed = await this.getExecutedMigrations();
    
    if (executed.length === 0) {
      logger.info('No migrations to rollback');
      await this.disconnect();
      return;
    }

    const toRollback = executed.slice(-lastN);

    for (const name of toRollback.reverse()) {
      logger.info(`Rolling back migration: ${name}`);
      
      try {
        const migration = require(path.join(this.migrationsDir, name));
        
        if (!migration.down) {
          logger.warn(`Migration ${name} has no down method, skipping rollback`);
          continue;
        }

        await this.connection.beginTransaction();
        await migration.down(this.connection);
        await this.connection.query(
          `DELETE FROM ${this.migrationsTable} WHERE name = ?`,
          [name]
        );
        await this.connection.commit();
        
        logger.info(`Migration ${name} rolled back successfully`);
      } catch (error) {
        await this.connection.rollback();
        logger.error(`Rollback of ${name} failed`, { error: error.message });
        throw error;
      }
    }

    await this.disconnect();
  }
}

module.exports = DatabaseMigrator;

// CLI usage
if (require.main === module) {
  const migrator = new DatabaseMigrator();
  const command = process.argv[2];

  if (command === 'run') {
    migrator.run().catch(console.error);
  } else if (command === 'status') {
    migrator.status().catch(console.error);
  } else if (command === 'rollback') {
    const count = parseInt(process.argv[3]) || 1;
    migrator.rollback(count).catch(console.error);
  } else {
    console.log('Usage: node db/migrator.js [run|status|rollback]');
  }
}
