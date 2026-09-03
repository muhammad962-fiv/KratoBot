import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Sheikhsaab333!",
  database: process.env.DB_NAME || "Kratobot",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// --- DB CONNECTION CHECK ON STARTUP ---
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("[DB] Connected successfully |",
      "host:", process.env.DB_HOST || "localhost",
      "| port:", process.env.DB_PORT || "3306",
      "| db:", process.env.DB_NAME || "Kratobot");
    conn.release();
  } catch (err: any) {
    console.error("[DB] Connection FAILED:", err.message);
    console.error("[DB] Check that MySQL is running and .env.local has correct values");
  }
})();
