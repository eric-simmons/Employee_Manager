DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;


CREATE TABLE departments(
    department_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (department_id)
);

CREATE TABLE roles(
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR (30) NOT NULL, 
    salary DECIMAL(10,2),
    department_id INT,
    PRIMARY KEY (role_id),
    FOREIGN KEY (department_id)
    REFERENCES departments(department_id)
    ON DELETE SET NULL
);

CREATE TABLE employees(
    employee_id INT NOT NULL  AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT, 
    manager_id INT REFERENCES employees(employee_id),
    PRIMARY KEY (employee_id),
    FOREIGN KEY (role_id) 
    REFERENCES roles(role_id)
    ON DELETE SET NULL
);