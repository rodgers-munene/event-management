/**
 * Migration 001: Add indexes for performance
 *
 * This migration adds database indexes to improve query performance
 * on frequently queried columns.
 */

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

async function up(connection) {
  console.log('Executing migration 001: Adding indexes...');

  // Index on events table
  await createIndexIfNotExists(connection, 'events', 'user_id', 'idx_events_user_id');
  await createIndexIfNotExists(connection, 'events', 'event_start_date', 'idx_events_start_date');
  await createIndexIfNotExists(connection, 'events', 'event_location', 'idx_events_location');
  await createIndexIfNotExists(connection, 'events', 'event_price', 'idx_events_price');

  // Index on users table
  await createIndexIfNotExists(connection, 'users', 'user_email', 'idx_users_email');

  // Index on payments table
  await createIndexIfNotExists(connection, 'payments', 'event_id', 'idx_payments_event_id');
  await createIndexIfNotExists(connection, 'payments', 'participant_name', 'idx_payments_user_id');
  await createIndexIfNotExists(connection, 'payments', 'transaction_id', 'idx_payments_transaction_id');

  // Index on registrations table (if it exists)
  try {
    await createIndexIfNotExists(connection, 'registrations', 'user_id', 'idx_registrations_user_id');
    await createIndexIfNotExists(connection, 'registrations', 'event_id', 'idx_registrations_event_id');
    await createIndexIfNotExists(connection, 'registrations', 'status', 'idx_registrations_status');
  } catch (error) {
    console.log('⚠ Registrations table may not exist yet, skipping indexes');
  }

  console.log('Migration 001 completed successfully!');
}

async function down(connection) {
  console.log('Rolling back migration 001: Dropping indexes...');

  const dropStatements = [
    'ALTER TABLE events DROP INDEX idx_events_user_id',
    'ALTER TABLE events DROP INDEX idx_events_start_date',
    'ALTER TABLE events DROP INDEX idx_events_location',
    'ALTER TABLE events DROP INDEX idx_events_price',
    'ALTER TABLE users DROP INDEX idx_users_email',
    'ALTER TABLE payments DROP INDEX idx_payments_event_id',
    'ALTER TABLE payments DROP INDEX idx_payments_user_id',
    'ALTER TABLE payments DROP INDEX idx_payments_transaction_id',
    'ALTER TABLE registrations DROP INDEX idx_registrations_user_id',
    'ALTER TABLE registrations DROP INDEX idx_registrations_event_id',
    'ALTER TABLE registrations DROP INDEX idx_registrations_status'
  ];

  for (const statement of dropStatements) {
    try {
      await connection.query(statement);
    } catch (error) {
      // Ignore errors for indexes that don't exist
    }
  }

  console.log('Migration 001 rolled back successfully!');
}

module.exports = {
  up,
  down,
};
