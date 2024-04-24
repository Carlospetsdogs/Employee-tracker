DROP DATABASE IF EXISTS employee_db; 
CREATE DATABASE employee_db;
USE employee_db;

-- create department table
CREATE TABLE department (
  id INT PRIMARY KEY AUTO_INCREMENT, 
  name VARCHAR(30)
);

-- create a table for employee roles
CREATE TABLE role (
  id INT PRIMARY KEY AUTO_INCREMENT, 
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create employee table
CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);