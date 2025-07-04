const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables

const createDatabasePool = () => {
  const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0, 
  });
  return pool.promise(); // Return a promisified pool
};

module.exports = createDatabasePool();
