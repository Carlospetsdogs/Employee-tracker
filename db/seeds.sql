USE employee_db;

-- insert departments into the 'department' table
INSERT INTO department(name)
VALUES('engineering'), ('management'),('legal'), ('finance');

-- Insert roles into the 'role' table
INSERT INTO role(title, salary, department_id)
VALUES ('engineer', 100000, 1), ('manager' , 200000, 2), ('lawyer', 120000, 3),('banker', 150000, 4);

-- Insert employees into the 'employee' table
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Luke', 'Skywalker', 1, NULL), ('Anakin', 'Skywalker', 2, 1),('Obi-wan', 'Kenobi', 4, NULL);