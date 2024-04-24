-- create department table
CREATE TABLE department (
  id INT PRIMARY KEY,
  name VARCHAR(30)
);

-- create a table for employee roles
CREATE TABLE role (
  id INT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);