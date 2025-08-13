import express from "express";
import db from "./configs/db.js";
import contactRouter from "./routes/contact-routes.js";

const app = express();
app.use(express.json());

db.connect().then(() => {
  console.log("postgres connected successfully!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`server is running... ${process.env.PORT || 3000}`);
});

app.use("/api/v1/contacts", contactRouter);
