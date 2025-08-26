import express from "express";
import db from "./configs/db.js";
import contactRouter from "./routes/contact-routes.js";
import authRouter from "./routes/auth-routes.js";
import dotenv from "dotenv";

dotenv.config();
// const PORT = process.env.DB_PORT || 3000;
const PORT = 3000;
const app = express();
app.use(express.json());

db.connect()
  .then(() => console.log("Connected to Supabase database successfully!"))
  .catch((err) => console.error("DB connection error:", err));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/contacts", contactRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
