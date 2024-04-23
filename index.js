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
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then(answer => {
        switch (answer.option) {
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
                console.log('Goodbye!');
                connection.end();
                break;
        }
    });
}
