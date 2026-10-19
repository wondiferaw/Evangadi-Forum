import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { readFileSync } from "node:fs";
dotenv.config();

const isAivenHost = process.env.DB_HOST?.endsWith(".aivencloud.com");
if (isAivenHost && !process.env.DB_SSL_CA_PATH) {
  throw new Error("DB_SSL_CA_PATH is required when connecting to Aiven");
}

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  charset: "utf8mb4",
  ssl: process.env.DB_SSL_CA_PATH
    ? {
        ca: readFileSync(process.env.DB_SSL_CA_PATH, "utf8"),
        rejectUnauthorized: true,
      }
    : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const ensureParams = (params) => {
  if (params === undefined || params === null) {
    throw new Error("SQL parameters are required");
  }
  const isArray = Array.isArray(params);
  const isObject = !isArray && typeof params === "object";
  if (!isArray && !isObject) {
    throw new Error("SQL parameters must be an array or object");
  }
};

const safeExecute = async (sql, params) => {
  if (typeof sql !== "string" || sql.trim().length === 0) {
    throw new Error("SQL query must be a non-empty string");
  }
  ensureParams(params);
  const [result] = await db.execute(sql, params);
  return result;
};

export { db, safeExecute };