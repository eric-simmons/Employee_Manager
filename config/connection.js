require('dotenv').config()
const mysql = require('mysql2')
const { DB_NAME, DB_USER, DB_PASSWORD } = process.env


const connection = mysql.createConnection(
    {
        host:'localhost',
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
    }
)

module.exports = connection