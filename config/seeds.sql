INSERT INTO departments (name)
VALUES("Human Resources"),("Accounting"),("Research and Development"),
("Administration"),("Marketing"),("Customer Service");

INSERT INTO roles (title, salary, department_id)
VALUES ("CEO",100000,4),
("Manager", 75000,4), 
("Accountant", 85000,2), 
("Marketing Specialist", 65000,5), 
("Customer Service Rep", 50000,6),
("Researcher", 70000,3),
("Human Resource Specialist", 40000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Ricky", "Bobby", 4, 4),
("Jimmy", "Jameson", 2, 4),
("Felicia", "Ferdinand", 3, 4),
("Dahlia", "James", 1, NULL),
("Euan", "Frederick", 5, 4),
("Debra", "Morrow", 6, 4),
("Melvin", "Montrose", 5, 4);
