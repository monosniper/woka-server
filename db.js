const Sequelize = require('sequelize')
const mysql = require("mysql");
require('dotenv').config()

const sequelize = new Sequelize(
    process.env.DB_USERNAME,
    process.env.DB_NAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',

        timezone: '+03:00',
    },
);

// Bans DB
const connection = mysql.createConnection({
    host: process.env.DB_BANS_HOST,
    user: process.env.DB_BANS_USERNAME,
    password: process.env.DB_BANS_PASSWORD,
    database: process.env.DB_BANS_NAME
})

module.exports = {sequelize, connection}