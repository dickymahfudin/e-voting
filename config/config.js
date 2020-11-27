require("dotenv").config();
const { DB_USER, DB_PASSWORD, DB_DB, DB_HOST, DB_CONNECTION } = process.env;

const username = DB_USER;
const password = DB_PASSWORD;
const database = DB_DB;
const host = DB_HOST;
const dialect = DB_CONNECTION;

module.exports = { username, password, database, host, dialect };
