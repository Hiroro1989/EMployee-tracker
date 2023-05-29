const mysql = require ('mysql2');
const inquire = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'hiro1108',
        database: 'employees_db'
    },
    console.log(`conndected to the employees_db`)
)

