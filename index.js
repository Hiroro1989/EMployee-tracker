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
          "Update Employee Role",
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
        
        case "Add an Employee":
            addSqlEM();
            break;
        case "Update Employee Role":
            updateSqlRL();
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
//showing role
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
//showing employee
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

//adding department
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

//adding role
const addSqlRL = () => {
    db.query(`SELECT * FROM department`, (err, departments) => {
      if (err) {
        console.log(err);
        return;
      }
  
      const departmentChoices = departments.map((department) => {
        return {
          name: department.name,
          value: department.id,
        };
      });
  
      inquire
        .prompt([
          {
            type: "input",
            name: "newRole",
            message: "What is the name of the role?",
          },
          {
            type: "input",
            name: "newSalary",
            message: "What is the salary of the role?",
          },
          {
            type: "list",
            name: "newRoleBelong",
            message: "Which department does the role belong to?",
            choices: departmentChoices,
          },
        ])
        .then((data) => {
          const sqlQuery =
            "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
          const params = [data.newRole, data.newSalary, data.newRoleBelong];
  
          db.query(sqlQuery, params, (err, result) => {
            if (err) {
              console.error(err);
            } else {
              console.log("Successfully added!");
            }
  
            init();
          });
        })
        .catch((error) => {
          console.log("An error occurred:", error);
        });
    });
  };

const addSqlEM = () => {
    db.query(`SELECT * FROM role`, (err, roles) => {
        if (err) {
            console.log(err);
            return;
        }

        const rolesChoice = roles.map((role) => {
            return {
                name: role.title,
                value: role.id,
            };
        });

        db.query(`SELECT * FROM employee`, (err, employees) => {
            if (err) {
                console.log(err);
                return;
            }

            const managerChoice = employees.map((employee) => {
                return {
                    name: employee.first_name + " " + employee.last_name,
                    value: employee.id,
                };
            });

            managerChoice.unshift({ name: "None", value: null });

            inquire.prompt([
                {
                    type: "input",
                    name: "newFirstName",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "newLastName",
                    message: "What is the employee's last name?"
                },
                {
                    type: "list",
                    name: "newRole",
                    message: "What is the employee's role?",
                    choices: rolesChoice
                },
                {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managerChoice
                }
            ])
            .then((data) => {
                const sqlQuery = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                const params = [
                    data.newFirstName,
                    data.newLastName,
                    data.newRole,
                    data.manager
                ];
                db.query(sqlQuery, params, (err, result) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("Successfully added!");
                    }
                    init();
                });
            })
            .catch((error) => {
                console.log("An error occurred:", error);
            });
        });
    });
};
//updating role
const updateSqlRL = () => {
    db.query(`SELECT * FROM employee`, (err, employees) => {
      if (err) {
        console.log(err);
        return;
      }
  
      const employeeChoices = employees.map((employee) => {
        return {
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        };
      });
  
      db.query(`SELECT * FROM role`, (err, roles) => {
        if (err) {
          console.log(err);
          return;
        }
  
        const roleChoices = roles.map((role) => {
          return {
            name: role.title,
            value: role.id,
          };
        });
  
        inquire
          .prompt([
            {
              type: "list",
              name: "employeeId",
              message: "Select the employee to update:",
              choices: employeeChoices,
            },
            {
              type: "list",
              name: "roleId",
              message: "Select the new role for the employee:",
              choices: roleChoices,
            },
          ])
          .then((data) => {
            const sqlQuery = "UPDATE employee SET role_id = ? WHERE id = ?";
            const params = [data.roleId, data.employeeId];
  
            db.query(sqlQuery, params, (err, result) => {
              if (err) {
                console.error(err);
              } else {
                console.log("Employee role updated successfully!");
              }
  
              init();
            });
          })
          .catch((error) => {
            console.log("An error occurred:", error);
          });
      });
    });
  };

  
init();
