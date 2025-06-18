const db = require('./config/db'); // Import the database connection

async function testConnection() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    console.log('Database connected successfully! Test query result:', rows[0].solution);
  } catch (error) {
    console.error('Database connection failed:', error.message);
  } finally {
    db.end(); // Close the connection pool after testing
  }
}

testConnection();
