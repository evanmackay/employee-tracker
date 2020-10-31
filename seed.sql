DROP DATABASE IF EXISTS employee_DB;

CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE department (
id INT AUTO_INCREMENT NOT NULL,
name VARCHAR(30) NULL,
PRIMARY KEY (id)
);

CREATE TABLE role (
id INT AUTO_INCREMENT NOT NULL,
title VARCHAR(30) NULL,
salary DECIMAL (10,2) NULL,
department_id INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE employee (
id INT AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NULL,
last_name VARCHAR(30) NULL,
role_id INT NOT NULL,
manager_id INT NULL,
PRIMARY KEY (id),
FOREIGN KEY (role_id) REFERENCES role (id) 
);

INSERT INTO department (name) VALUES ("Sales");

INSERT INTO role (department_id, title, salary) VALUES (1, "Salesman", 150000.50);

INSERT INTO employee (first_name, last_name, role_id) VALUES ("Arnold", "Robles",1);


SELECT * FROM department;

SELECT * FROM role;

SELECT * FROM employee;