//install packages
const mysql = require("mysql2");
const inquire = require("inquirer");
const cTable = require("console.table");

//connecting DB
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "hiro1108",
    database: "employees_db",
  },
  console.log(`conndected to the employees_db`)
);

//initial function
const init = () => {
  inquire
    .prompt([
      {
        type: "list",
        name: "query",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Quit",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.query) {
        case "View All Departments":
          showSqlDP();
          break;

        case "View All Roles":
          showSqlRL();
          break;

        case "View All Employees":
          showSqlEM();
          break;

        case "Add a Department":
            addSqlDP();
            break;

        case "Add a Role":
            addSqlRL();
            break;

        case "Quit":
          console.log("Exiting the program....");
          process.exit();
          break;
      }
    })
    .catch((error) => {
      console.log("An error occurred:", error);
    });
};

//function for showing department table
const showSqlDP = () => {
  db.query(`SELECT * FROM department`, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.table(res);
    }
    init();
  });
};

const showSqlRL = () => {
  db.query(
    `SELECT role.id, role.title, department.name, role.salary FROM role INNER JOIN department ON department.id = role.department_id`,
    (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.table(res);
      }
      init();
    }
  );
};

const showSqlEM = () => {
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name," ",m.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee m ON m.id = employee.manager_id;`,
    (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.table(res);
      }
      init();
    }
  );
};

const addSqlDP = () => {
    inquire.prompt([
        {
            type: "input",
            name: "newDepartment",
            message: "What is the name of department?"
        }
    ])
    .then((data)=>{
        const sqlQuery = `INSERT INTO department (name) VALUE ("${data.newDepartment}")`;
        db.query(sqlQuery, (err, result) =>{
            if (result){
                console.log("Successfully added!");
            }else{
                console.error(err);
            }
            init();
        })
    })
};

const addSqlRL = () => {
    let departmentChoices;
    db.query(`SELECT * FROM department`, (err, departments)=>{
        if(err) console.log(err);
        // console.log("Departments:", departments);
        departmentChoices = departments.map((department)=>{
            return {
                name: department.name,
                value: department.id,
            }
                
        })
        console.log("Department Choices:", departmentChoices);
    })
    
            // console.log("Department Choices:", departmentChoices);

    
    inquire.prompt([
        {
            type: "input",
            name: "newRole",
            message: "What is the name of the role?"
        },
        {
            type: "input",
            name: "newSalary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "newRoleBelong",
            message: "Which department does the role belong to?",
            choices: departmentChoices,
        }
    ]).then((data)=>{
        const sqlQuery =
          "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
        const params = [
          data.newRole,
          data.newSalary,
          data.newRoleBelong,
        ];
        db.query(sqlQuery, params, (err, result)=>{
            if (result){
                console.log("Successfully added!");
            }else{
                console.error(err);
            }
            init(); 
        })
            
    })
}
init();
