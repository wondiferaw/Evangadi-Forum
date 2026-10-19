import { safeExecute } from "./schema/db.config.js";

async function testConnection() {
  try {
    const result = await safeExecute("SELECT 1 + 1 AS solution", []);
    console.log("Database connection successful! Solution:", result[0].solution);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

testConnection();