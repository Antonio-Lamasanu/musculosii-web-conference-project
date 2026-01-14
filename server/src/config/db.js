const { Sequelize } = require("sequelize");

const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_NAME = "conference_db",
  DB_USER = "conference_user",
  DB_PASS = "conference_pass",
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "mysql",
  logging: false,
});

async function testDbConnection() {
  await sequelize.authenticate();
}

module.exports = { sequelize, testDbConnection };
