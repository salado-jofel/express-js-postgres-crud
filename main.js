import express from "express";
import db from "./configs/db.js";
import contactRouter from "./routes/contact-routes.js";
import authRouter from "./routes/auth-routes.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.DB_PORT;
// const PORT = 3000;
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

// DB_USER=postgres.iwauxognixhgwftlvvlj
// DB_PASSWORD=Ws23833hzzj123k!
// BASE_URL=aws-1-ap-southeast-1.pooler.supabase.com
// DB_PORT=5432
// DATABASE=postgres
// JWT_SECRET=f2c9b7012ff54a7d0d02e0954aec9436
// JWT_REFRESH_SECRET=af5df1e673085794ae41cd5cc965cfb5
