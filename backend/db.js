// const Pool = require("pg").Pool;

const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit : 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'momnt_app',
    port:3306,
    charset : 'utf8mb4',
    multipleStatements:true
})


// const pool = new Pool({
//     user: process.env.POSTGRES_RDS_USERNAME,
//     password: process.env.POSTGRES_RDS_PWD,
//     host: "main-postgres-db.c3bllwgxn2ue.us-east-1.rds.amazonaws.com",
//     post: 5432,
//     database: "main_postgres_db"
// })

module.exports = pool;