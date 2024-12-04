import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { connectDb } from "./db/index";
import mainRouter from "./route/index";

config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  cookieParser(process.env.jwt_SECRET || "ierjn4iwnc5ojm45nicn3diwmdr344niri"),
);
app.use("/api", mainRouter);

app.listen(5000, async () => {
  await connectDb();
  console.log(`Server listening on port 5000`);
});
