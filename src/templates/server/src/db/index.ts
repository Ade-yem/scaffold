import { connectSequelize } from "./connectSequelize";
import { connectMongoose } from "./connectMongoose";
import config from "../../server.config.mjs";

export const connectDb = async () => {
  if (config.database === "mongodb") {
    await connectMongoose();
  } else {
    await connectSequelize();
  }
};
