const { prompt } = require('inquirer');
const mysql = require('mysql');

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