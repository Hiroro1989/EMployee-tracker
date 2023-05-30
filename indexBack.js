//install packages
const mysql = require("mysql2");
const inquire = require("inquirer");
const cTable = require("console.table");
// const Connection = require("mysql2/typings/mysql/lib/Connection");
const MaxLengthInputPrompt = require("inquirer-maxlength-input-prompt");
inquirer.registerPrompt("maxlength-input", MaxLengthInputPrompt);

//connecteing database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "hiro1108",
    database: "employees_db",
  },
  console.log(`conndected to the employees_db`)
);

const sqlShowing = ({ query }) => {
  let queryText;
  switch (query) {
    case "View All Departments":
      //   queryText = `SELECT * FROM department`;
      showSqlDP();
      break;

    case "View All Roles":
      //   queryText = `SELECT role.id, role.title, department.name, role.salary FROM role INNER JOIN department ON department.id = role.department_id`;
      break;

    case "View All Employees":
      queryText = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name," ",m.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee m ON m.id = employee.manager_id;`;
      break;
    case "Add a Department":
      queryText = `addD`;
      break;
    case "Add a Role":
      queryText = `addR`;
      break;
    case "Add an Employee":
      queryText = `addE`;
      break;
    case "Quit":
      console.log("Exiting the program....");
      process.exit();
      break;
    default:
      queryText = "";
  }
  return queryText;
};

function promptUser() {
  inquire.prompt([
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
  ]);

  
  //     .then((res) => {
  //       const content = sqlShowing(res);

  //       if (
  //         content === "SELECT * FROM department" ||
  //         content ===
  //           "SELECT role.id, role.title, department.name, role.salary FROM role INNER JOIN department ON department.id = role.department_id" ||
  //         content ===
  //           'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name," ",m.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee m ON m.id = employee.manager_id;'
  //       ) {
  //         db.query(content, (err, result) => {
  //           if (result) {
  //             console.log("");
  //             console.table(result);
  //             promptUser(); // Recursive call to ask the question again
  //           } else {
  //             console.error(err);
  //           }
  //         });
  //       } else if (content == "addD") {
  //         const newDepartment = () =>
  //         inquire.prompt({
  //             name: "department",
  //             type: "input",
  //             message: "What is the name of department?"
  //         })
  //         .then((res)=>{
  //             const param = newDepartment(res);
  //             db.query(`INSERT INTO department (name) VALUES (?)`, [param.department] ,(err,res) =>{
  //                 if (res){
  //                     console.log('Succesfully Added!');
  //                     promptUser();
  //                 }else{
  //                     console.error(err);
  //                     promptUser();
  //                 }
  //             } )}
  //         )
  //         console.log("addD");
  //         promptUser(); // Recursive call to ask the question again
  //       } else if (content == "addR"){
  //         console.log("addR");
  //         promptUser(); // Recursive call to ask the question again
  //       }else if(content == "addE"){
  //         console.log("addE");
  //         promptUser();
  //       }else{
  //         console.log('Other logic');
  //         promptUser();
  //       }
  //     });
}

const showSqlDP = () => {
    db.query(`SELECT * FROM department`, (err, res) => {
      if (err) {
        console.error(err);
        promptUser();
      } else {
        console.table(res);
        promptUser();
      }
    });
  };

promptUser();
// Initial call to start the prompt

//     inquire.prompt(
//         [
//             {
//                 type: "list",
//                 name: "query",
//                 message: "What would you like to do?",
//                 choices: [
//                    "View All Departments",
//                    "View All Roles",
//                    "View All Employees",
//                    "Quit",
//                 ],
//             },
//         ],
//      )
// .then((res) =>{
//     const content = sqlShowing(res);

//     if(content === 'SELECT * FROM department' || 'SELECT role.id, role.title, department.name, role.salary FROM role INNER JOIN department ON department.id = role.department_id' || 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name," ",m.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee m ON m.id = employee.manager_id;'){
//         db.query(content, (err, result) =>{
//             if (result){
//                 console.log('')
//                 console.table(result);
//                 promptUser();
//             } else {
//                 console.error(err)
//             }
//         });
//     }else {console.log('done')}

// db.query(content, (err, result) =>{
//     if (result){
//         console.log('')
//         console.table(result);
//         return inquire;
//     } else {
//         console.error(err)
//     }
// });
//  })

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
