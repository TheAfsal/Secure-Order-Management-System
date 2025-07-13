import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });

console.log(process.env.MYSQL_DB);


const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log("Database connection successful");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

export { pool, testConnection };
