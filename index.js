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

//connect app

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
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
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
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
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

// function to add a department
function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
    }).then(answer => {
        connection.query('INSERT INTO departments SET ?', { name: answer.name }, (err, res) => {
            if (err) throw err;
            console.log('Department added successfully!');
            promptUser();
        });
    });
}


// function to add a role
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:'
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'Enter the department ID for the role:'
        }
    ]).then(answers => {
        connection.query('INSERT INTO roles SET ?', answers, (err, res) => {
            if (err) throw err;
            console.log('Role added successfully!');
            promptUser();
        });
    });
}

// function to add an employee 
function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "Enter the employee's first name:"
        },
        {
            type: 'input',
            name: 'last_name',
            message: "Enter the employee's last name:"
        },
        {
            type: 'input',
            name: 'role_id',
            message: "Enter the employee's role ID:"
        },
        {
            type: 'input',
            name: 'manager_id',
            message: "Enter the employee's manager ID:"
        }
    ]).then(answers => {
        connection.query('INSERT INTO employees SET ?', answers, (err, res) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            promptUser();
        });
    });
}

// function to update an employee role
function updateEmployeeRole() {

    connection.query('SELECT * FROM employees', (err, employees) => {
        if (err) throw err;

        inquirer.prompt({
            type: 'list',
            name: 'employeeId',
            message: 'Select an employee to update:',
            choices: employees.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }))
        }).then(answer => {
            inquirer.prompt({
                type: 'input',
                name: 'newRoleId',
                message: 'Enter the new role ID for the employee:'
            }).then(answer => {
                // update the employee's role in the database
                connection.query(
                    'UPDATE employees SET role_id = ? WHERE id = ?',
                    [answer.newRoleId, answer.employeeId],
                    (err, res) => {
                        if (err) throw err;
                        console.log('Employee role updated successfully!');
                        promptUser();
                    }
                );
            });
        });
    });
}

// connect to the MySQL database and start the application
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the database!');
    startApp();
  });