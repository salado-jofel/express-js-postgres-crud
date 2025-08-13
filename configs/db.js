import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();
console.log("Connecting to database...: ", process.env.CONNECTION_STRING_NEON);
const db = new Client({
  host: process.env.BASE_URL,
  port: process.env.DB_PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  // connectionString: process.env.CONNECTION_STRING_NEON,
  ssl: { rejectUnauthorized: false },
});

export default db;
