import { Sequelize } from "sequelize";

import config from "../../server.config";

const username = process.env.DB_USER || "root";
const database = process.env.DB_NAME || "scaffold";
const password = process.env.DB_PASSWORD || "root";
const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT || "3306";

export const sequelize = new Sequelize(database, username, password, {
  dialect: config.dialect,
  host: host,
  port: parseInt(port),
  logging: process.env.ENV === "development" ? console.log : false,
});
