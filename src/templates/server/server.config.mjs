/**
 * @module server.config
 * @description This module handles the configuration of the server's database
 */

/**
 * @typedef {Object} Config
 * @property {"sql" | "mongodb"} database - The type of database to be used
 * @property {"mysql" | "postgres" | "sqlite" | "mariadb" | "mssql" | "db2" | "snowflake" | "oracle"} dialect - The specific database dialect. 
 */

/**
 * The server configuration
 * @type Config
 */

const serverConfig = {
  database: "sql",
  dialect: "mysql"
};

export default serverConfig;