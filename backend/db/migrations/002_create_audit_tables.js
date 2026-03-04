/**
 * Migration 002: Create audit tables
 * 
 * This migration creates audit tables to track changes to critical data.
 */

async function up(connection) {
  console.log('Executing migration 002: Creating audit tables...');

  // Create audit_logs table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      table_name VARCHAR(100) NOT NULL,
      record_id INT NOT NULL,
      action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
      old_values JSON,
      new_values JSON,
      changed_by INT,
      changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ip_address VARCHAR(45),
      user_agent VARCHAR(255),
      INDEX idx_audit_table_name (table_name),
      INDEX idx_audit_record_id (record_id),
      INDEX idx_audit_changed_at (changed_at),
      INDEX idx_audit_changed_by (changed_by)
    )
  `);
  console.log('✓ Created audit_logs table');

  // Create event_audit table for detailed event change tracking
  await connection.query(`
    CREATE TABLE IF NOT EXISTS event_audit (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      action ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
      field_changed VARCHAR(100),
      old_value TEXT,
      new_value TEXT,
      changed_by INT,
      changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_event_audit_event_id (event_id),
      INDEX idx_event_audit_changed_at (changed_at),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `);
  console.log('✓ Created event_audit table');

  // Add triggers for events table
  await connection.query(`
    CREATE TRIGGER IF NOT EXISTS after_events_insert
    AFTER INSERT ON events
    FOR EACH ROW
    BEGIN
      INSERT INTO audit_logs (table_name, record_id, action, new_values, changed_by)
      VALUES ('events', NEW.id, 'INSERT', JSON_OBJECT(
        'event_title', NEW.event_title,
        'event_start_date', NEW.event_start_date,
        'event_end_date', NEW.event_end_date,
        'event_location', NEW.event_location,
        'event_price', NEW.event_price
      ), NEW.user_id);
    END
  `);
  console.log('✓ Created trigger for events INSERT');

  await connection.query(`
    CREATE TRIGGER IF NOT EXISTS after_events_update
    AFTER UPDATE ON events
    FOR EACH ROW
    BEGIN
      INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, changed_by)
      VALUES ('events', NEW.id, 'UPDATE', JSON_OBJECT(
        'event_title', OLD.event_title,
        'event_start_date', OLD.event_start_date,
        'event_end_date', OLD.event_end_date,
        'event_location', OLD.event_location,
        'event_price', OLD.event_price
      ), JSON_OBJECT(
        'event_title', NEW.event_title,
        'event_start_date', NEW.event_start_date,
        'event_end_date', NEW.event_end_date,
        'event_location', NEW.event_location,
        'event_price', NEW.event_price
      ), NEW.user_id);
    END
  `);
  console.log('✓ Created trigger for events UPDATE');

  await connection.query(`
    CREATE TRIGGER IF NOT EXISTS after_events_delete
    AFTER DELETE ON events
    FOR EACH ROW
    BEGIN
      INSERT INTO audit_logs (table_name, record_id, action, old_values, changed_by)
      VALUES ('events', OLD.id, 'DELETE', JSON_OBJECT(
        'event_title', OLD.event_title,
        'event_start_date', OLD.event_start_date,
        'event_end_date', OLD.event_end_date,
        'event_location', OLD.event_location,
        'event_price', OLD.event_price
      ), OLD.user_id);
    END
  `);
  console.log('✓ Created trigger for events DELETE');

  console.log('Migration 002 completed successfully!');
}

async function down(connection) {
  console.log('Rolling back migration 002: Dropping audit tables...');

  // Drop triggers
  await connection.query('DROP TRIGGER IF EXISTS after_events_insert');
  await connection.query('DROP TRIGGER IF EXISTS after_events_update');
  await connection.query('DROP TRIGGER IF EXISTS after_events_delete');
  console.log('✓ Dropped triggers');

  // Drop audit tables
  await connection.query('DROP TABLE IF EXISTS event_audit');
  console.log('✓ Dropped event_audit table');

  await connection.query('DROP TABLE IF EXISTS audit_logs');
  console.log('✓ Dropped audit_logs table');

  console.log('Migration 002 rolled back successfully!');
}

module.exports = {
  up,
  down,
};
