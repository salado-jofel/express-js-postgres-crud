import express from "express";
import db from "./configs/db.js";
import contactRouter from "./routes/contact-routes.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

db.connect()
  .then(() => console.log("Connected to Neon PostgreSQL"))
  .catch((err) => console.error("DB connection error:", err));
console.log("MAIN PORT: ", process.env.PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/v1/contacts", contactRouter);
