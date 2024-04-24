const { prompt } = require('inquirer');
const mysql = require('mysql');

init();

// create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

// start the application
function startApp() {
    console.log('Welcome to Employee Management System!');
    promptUser();
}

function init() {
    const logoText = logo({ name: "Employee Manager" }).render();

    console.log(logoText);
}

// function to prompt the user with options
function promptUser() {
    inquirer.prompt({
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'View all employees by Department',
            'View all employees by Manager',
            'Add a department',
            'Remove department',
            'Add a role',
            'Remove role',
            'Add an employee',
            'Remove an employee',
            'Update an employee role',
            'Update employee Manager',
            'View budget by department',
            'Exit'
        ]
    }).then(answer => {
        switch (answer.option) {
            // calls function based on users choice
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'View all employees by Dapartment':
                viewEmployeesByDepartment();
                break;
            case 'View all employees by Manager':
                viewEmployeesByManager();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Remove a department':
                removeDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Remove role':
                removeRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Remove an employee':
                removeEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Update employee Manager':
                updateEmployeeManager();
                break;
            case 'View budget by department':
                viewBudgetByDepartment();
                break;
            case 'Exit':
                console.log('See you later!');
                connection.end();
                break;
        }
    });
}

// function to view all departments
function viewDepartments() {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}

// function to view all roles
function viewRoles() {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}

// function to view all employees
function viewEmployees() {
    connection.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}

// function to view employess by their departments****
function viewEmployeesByDepartment() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department would you like to see employees for?",
                    choices: departmentChoices
                }
            ])
                .then(res => db.findAllEmployeesByDepartment(res.departmentId))
                .then(([rows]) => {
                    let employees = rows;
                    console.log("\n");
                    console.table(employees);
                })
                .then(() => promptUser())
        });
}


// function to view employess by a speicified manager
function viewEmployeesByManager() {
    db.findAllEmployees()
        .then(([rows]) => {
            let managers = rows;
            const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "managerId",
                    message: "Which employee do you want to see direct reports for?",
                    choices: managerChoices
                }
            ])
                .then(res => db.findAllEmployeesByManager(res.managerId))
                .then(([rows]) => {
                    let employees = rows;
                    console.log("\n");
                    if (employees.length === 0) {
                        console.log("The selected employee has no direct reports");
                    } else {
                        console.table(employees);
                    }
                })
                .then(() => promptUser())
        });
}

// function to remove a specified employee
function removeEmployee() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee do you want to remove?",
                    choices: employeeChoices
                }
            ])
                .then(res => db.removeEmployee(res.employeeId))
                .then(() => console.log("Removed employee from the database"))
                .then(() => promptUser())
        })
}

// function to update a specified employees role
function updateEmployeeRole() {
    db.findAllEmployees()
      .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id
        }));
  
        prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee's role do you want to update?",
            choices: employeeChoices
          }
        ])
          .then(res => {
            let employeeId = res.employeeId;
            db.findAllRoles()
              .then(([rows]) => {
                let roles = rows;
                const roleChoices = roles.map(({ id, title }) => ({
                  name: title,
                  value: id
                }));
  
                prompt([
                  {
                    type: "list",
                    name: "roleId",
                    message: "Which role do you want to assign the selected employee?",
                    choices: roleChoices
                  }
                ])
                  .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                  .then(() => console.log("Updated employee's role"))
                  .then(() => promptUser())
              });
          });
      })
  }

