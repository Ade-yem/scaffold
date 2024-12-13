/**
 * @module server.config
 * @description This module handles the configuration of the server's database
 */

import { Dialect } from "sequelize";



/**
 * @typedef {Object} Config
 * @property {"sql" | "mongodb"} database - The type of database to be used
 * @property {"mysql" | "postgres" | "sqlite" | "mariadb" | "mssql" | "db2" | "snowflake" | "oracle"} dialect - The specific database dialect. 
 */
interface Config {
  database: "sql" | "mongodb";
  dialect: Dialect;
};



/**
 * The server configuration
 * @type Config
 */

const serverConfig: Config = {
  database: "sql",
  dialect: "mysql"
};

export default serverConfig;