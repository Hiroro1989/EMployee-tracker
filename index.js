//install packages
const mysql = require ('mysql2');
const inquire = require('inquirer');
const cTable = require('console.table');
// const MaxLengthInputPrompt = require("inquirer-maxlength-input-prompt");
// inquirer.registerPrompt("maxlength-input", MaxLengthInputPrompt);

//connecteing database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'hiro1108',
        database: 'employees_db'
    },
    console.log(`conndected to the employees_db`)
);


const sqlShowing = ({
    query,
}) => {
    let queryText;
    switch(query){
        case "View All Departments":
            queryText = `SELECT * FROM department`;
            break;
            
        case "View All Roles":
            queryText = `SELECT role.id, role.title, department.name, role.salary FROM role INNER JOIN department ON department.id = role.department_id`;
            break;
            
        case "View All Employees":
            queryText = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name," ",m.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee m ON m.id = employee.manager_id;`;      
            break;
        case "Quit":
            queryText = ``;
            break;
        default:
            queryText = "";  

    }
    return queryText;
}


    inquire.prompt(
        [
            {
                type: "list",
                name: "query",
                choices: [
                   "View All Departments",
                   "View All Roles",
                   "View All Employees",
                   "Quit",
                ],
            },
        ],
     )
.then((res) =>{
    const content = sqlShowing(res);

    db.query(content, (err, result) =>{
        if (result){
            console.log('')
            console.table(result);
        } else {
            console.error(err)
        }
    });
 })



//reading eachtables
//showing depeartment table
// const sqlShowDP =`SELECT * FROM department`

// db.query(sqlShowDP, (err, result) =>{
//     if (result){
//         console.log('')
//         console.table(result);
//     } else {
//         console.error(err)
//     }
// });
// //showing role table
// const sqlShowRole = `SELECT * FROM role`

// db.query(sqlShowRole, (err, result) =>{
//     if (result){
//         console.log('')
//         console.table(result);
//     } else {
//         console.error(err)
//     }
// });

// //showing employee table
// const sqlShowEmployee = `SELECT * FROM employee`
// db.query(sqlShowEmployee, (err, result) =>{
//     if (result){
//         console.log('')
//         console.table(result);
//     } else {
//         console.error(err)
//     }
// })

