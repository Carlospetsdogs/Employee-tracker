const { prompt } = require('inquirer');
const mysql2 = require('mysql2');
const logo = require("asciiart-logo");


init();

// create a connection to the MySQL database
const connection = mysql2.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'employee_db'
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
    prompt({
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
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}

// function to view all roles
function viewRoles() {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}

// function to view all employees
function viewEmployees() {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}

// function to add a department
function addDepartment() {
    prompt({
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
    prompt([
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
    prompt([
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

async function updateEmployeeRole() {
    try {
        // Fetch employees from the database
        const employees = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM employee', (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        // Check if there are employees in the database
        if (employees.length === 0) {
            console.log("No employees found.");
            promptUser();
            return;
        }

        // Create choices for the employee selection prompt
        const employeeChoices = employees.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));

        // Prompt the user to select an employee to update
        const { employeeId } = await prompt({
            type: 'list',
            name: 'employeeId',
            message: 'Select an employee to update:',
            choices: employeeChoices
        });

        // Prompt the user to enter the new role ID
        const { newRoleId } = await prompt({
            type: 'input',
            name: 'newRoleId',
            message: 'Enter the new role ID for the employee:'
        });

        // Update the employee's role in the database
        const updateResult = await new Promise((resolve, reject) => {
            connection.query(
                'UPDATE employees SET role_id = ? WHERE id = ?',
                [newRoleId, employeeId],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });

        // Check if the update was successful
        if (updateResult.affectedRows > 0) {
            console.log('Employee role updated successfully!');
        } else {
            console.log('No employee found with the provided ID.');
        }

        // Prompt the user with the main options again
        promptUser();
    } catch (err) {
        console.error('Error updating employee role:', err);
    }
}


// connect to the MySQL database and start the application
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the database!');
    startApp();
});