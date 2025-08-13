import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();
console.log("process.env.BASE_URL: ", process.env.BASE_URL);
console.log("process.env.DB_PORT: ", process.env.DB_PORT);
console.log("process.env.DB_USER: ", process.env.DB_USER);
console.log("process.env.DB_PASSWORD: ", process.env.DB_PASSWORD);
console.log("process.env.DATABASE: ", process.env.DATABASE);
const db = new Client({
  host: process.env.BASE_URL,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  // connectionString: process.env.DB_CONNECTION,
  ssl: { rejectUnauthorized: false },
});

export default db;
