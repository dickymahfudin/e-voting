require("dotenv").config();
const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  DB_CONNECTION,
  DB_HOST,
} = process.env;

const username = POSTGRES_USER;
const password = POSTGRES_PASSWORD;
const database = POSTGRES_DB;
const host = DB_HOST;
const dialect = DB_CONNECTION;

module.exports = { username, password, database, host, dialect };
