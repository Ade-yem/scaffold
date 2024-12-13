import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressListRoutes from "express-list-routes";
import { config } from "dotenv";
import { connectDb } from "./db/index";
import mainRouter from "./route/index";

config();
const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser(process.env.jwt_SECRET || ""));
app.use("/api", mainRouter);

app.get("/api/routes", async (req, res) => {
  console.log("All routes");
  const data = expressListRoutes(app)
  res.json(data);
});

app.listen(5000, async () => {
  await connectDb();
  console.log(`Server listening on port 5000`);
});
