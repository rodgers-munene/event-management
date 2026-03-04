/**
 * Migration 003: Improve database schema
 *
 * This migration adds better constraints, foreign keys, and useful columns.
 */

async function columnExists(connection, tableName, columnName) {
  const [rows] = await connection.query(`
    SHOW COLUMNS FROM ${tableName} LIKE ?
  `, [columnName]);
  return rows.length > 0;
}

async function addColumnIfNotExists(connection, tableName, columnName, definition) {
  const exists = await columnExists(connection, tableName, columnName);
  if (exists) {
    return false;
  }
  await connection.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  return true;
}

async function addColumnsIfNotExists(connection, tableName, columns) {
  for (const [col, def] of Object.entries(columns)) {
    await addColumnIfNotExists(connection, tableName, col, def);
  }
}

async function indexExists(connection, tableName, indexName) {
  const [rows] = await connection.query(`
    SHOW INDEX FROM ${tableName} WHERE Key_name = ?
  `, [indexName]);
  return rows.length > 0;
}

async function createIndexIfNotExists(connection, tableName, columnName, indexName) {
  const exists = await indexExists(connection, tableName, indexName);
  if (exists) {
    console.log(`  - Index ${indexName} already exists, skipping`);
    return;
  }
  await connection.query(`CREATE INDEX ${indexName} ON ${tableName}(${columnName})`);
  console.log(`✓ Added index ${indexName} on ${tableName}.${columnName}`);
}

async function tableExists(connection, tableName) {
  const [rows] = await connection.query(`
    SHOW TABLES LIKE ?
  `, [tableName]);
  return rows.length > 0;
}

async function up(connection) {
  console.log('Executing migration 003: Improving database schema...');

  // Add soft delete columns
  try {
    await addColumnIfNotExists(connection, 'events', 'deleted_at', 'TIMESTAMP NULL');
    await addColumnIfNotExists(connection, 'events', 'is_deleted', 'BOOLEAN DEFAULT FALSE');
    console.log('✓ Added soft delete columns to events');
  } catch (error) {
    console.log('⚠ Soft delete columns may already exist');
  }

  // Add status column to events
  try {
    await addColumnIfNotExists(connection, 'events', 'status', "ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'draft'");
    console.log('✓ Added status column to events');
  } catch (error) {
    console.log('⚠ Status column may already exist');
  }

  // Add capacity column to events
  try {
    await addColumnIfNotExists(connection, 'events', 'capacity', 'INT NULL');
    console.log('✓ Added capacity column to events');
  } catch (error) {
    console.log('⚠ Capacity column may already exist');
  }

  // Improve users table
  try {
    await addColumnIfNotExists(connection, 'users', 'phone', 'VARCHAR(20) NULL');
    await addColumnIfNotExists(connection, 'users', 'organization', 'VARCHAR(255) NULL');
    await addColumnIfNotExists(connection, 'users', 'is_active', 'BOOLEAN DEFAULT TRUE');
    await addColumnIfNotExists(connection, 'users', 'last_login', 'TIMESTAMP NULL');
    await addColumnIfNotExists(connection, 'users', 'role', "ENUM('user', 'organizer', 'admin') DEFAULT 'user'");
    console.log('✓ Added columns to users table');
  } catch (error) {
    console.log('⚠ User columns may already exist');
  }

  // Add indexes for new columns
  await createIndexIfNotExists(connection, 'events', 'status', 'idx_events_status');
  await createIndexIfNotExists(connection, 'events', 'is_deleted', 'idx_events_is_deleted');
  await createIndexIfNotExists(connection, 'users', 'role', 'idx_users_role');

  // Add foreign key constraint for payments (if not exists)
  try {
    await connection.query(`
      ALTER TABLE payments
      ADD CONSTRAINT fk_payments_event
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    `);
    console.log('✓ Added foreign key constraint for payments');
  } catch (error) {
    console.log('⚠ Foreign key may already exist');
  }

  // Create registrations table if it doesn't exist
  const registrationsExists = await tableExists(connection, 'registrations');
  if (!registrationsExists) {
    await connection.query(`
      CREATE TABLE registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        event_id INT NOT NULL,
        status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_registration (user_id, event_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        INDEX idx_registrations_user_id (user_id),
        INDEX idx_registrations_event_id (event_id),
        INDEX idx_registrations_status (status)
      )
    `);
    console.log('✓ Created registrations table');
  } else {
    console.log('✓ Registrations table already exists');
  }

  console.log('Migration 003 completed successfully!');
}

async function down(connection) {
  console.log('Rolling back migration 003: Reverting schema improvements...');

  // Remove foreign keys
  try {
    await connection.query('ALTER TABLE payments DROP FOREIGN KEY fk_payments_event');
    console.log('✓ Removed foreign key from payments');
  } catch (error) {
    console.log('⚠ Foreign key may not exist');
  }

  // Remove columns from events
  try {
    await connection.query('ALTER TABLE events DROP COLUMN deleted_at');
    await connection.query('ALTER TABLE events DROP COLUMN is_deleted');
    await connection.query('ALTER TABLE events DROP COLUMN status');
    await connection.query('ALTER TABLE events DROP COLUMN capacity');
    console.log('✓ Removed columns from events');
  } catch (error) {
    console.log('⚠ Some columns may not exist');
  }

  // Remove columns from users
  try {
    await connection.query('ALTER TABLE users DROP COLUMN phone');
    await connection.query('ALTER TABLE users DROP COLUMN organization');
    await connection.query('ALTER TABLE users DROP COLUMN is_active');
    await connection.query('ALTER TABLE users DROP COLUMN last_login');
    await connection.query('ALTER TABLE users DROP COLUMN role');
    console.log('✓ Removed columns from users');
  } catch (error) {
    console.log('⚠ Some columns may not exist');
  }

  // Drop indexes
  try {
    await connection.query('ALTER TABLE events DROP INDEX idx_events_status');
    await connection.query('ALTER TABLE events DROP INDEX idx_events_is_deleted');
    await connection.query('ALTER TABLE users DROP INDEX idx_users_role');
    console.log('✓ Dropped indexes');
  } catch (error) {
    console.log('⚠ Some indexes may not exist');
  }

  console.log('Migration 003 rolled back successfully!');
}

module.exports = {
  up,
  down,
};
