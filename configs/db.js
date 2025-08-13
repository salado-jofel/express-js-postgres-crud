import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new Client({
  host: process.env.BASE_URL,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  ssl: { rejectUnauthorized: false },
});

export default db;
