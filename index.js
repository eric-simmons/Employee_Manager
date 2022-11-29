//need to refactor all of the reused queries....

require('dotenv').config()
const inquirer = require('inquirer')
require('console.table')
const connection = require('./config/connection.js')
const process = require('process')
const { query } = require('./config/connection.js')


const showDepartments = async () => {
    //returns all departments
    try {
        const [results] = await connection.promise().query(`SELECT * FROM departments`)
        console.table(results)
        init()
    }
    catch (error) {
        throw new Error(error)
    }
}
const showRoles = async () => {
    //returns all roles and displays department name from association with roles.department_id
    try {
        const [results] = await connection.promise().query(
            `SELECT 
                roles.role_id,
                roles.title,
                roles.salary,
                departments.name AS department
            FROM roles
            INNER JOIN departments ON roles.department_id=departments.department_id`
        )
        console.table(results)
        init()
    }
    catch (error) {
        throw new Error(error)
    }
}
const showEmployees = async () => {
    //joins employees with roles and departments. returns names of roles, department and managers based on associations with id numbers
    try {
        const [results] = await connection.promise().query(
            `SELECT 
                employees.employee_id,
                CONCAT (employees.first_name, ' ', employees.last_name) AS name,
                roles.title,
                roles.salary,
                departments.name as department,
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
            FROM employees
            INNER JOIN roles ON employees.role_id=roles.role_id
            INNER JOIN departments ON roles.department_id=departments.department_id
            LEFT JOIN employees manager on manager.employee_id = employees.manager_id;
            `
        )
        console.table(results)
        init()
    }
    catch (error) {
        throw new Error(error)
    }
}
const addDepartment = async () => {
    //add department by name
    const answer = await inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'What is the name of the New Department you would like to add?'
    }])
    try {
        await connection.promise().query(
            `INSERT INTO departments(name) VALUES (?)`, [answer.name]
        )
        showDepartments()
        init()
    }
    catch (error) {
        throw new Error(error)
    }
}
const addRole = async () => {
    //select all current department names
    connection.query(`SELECT name FROM departments`, async (error, res) => {
        const answer = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of the new Role you would like to add?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary for the new Role?"
            },
            {
                type: "list",
                name: "department",
                message: "What department does this role belong to?",
                choices: res.map(departments => departments.name)
            }
        ])
        //get department id from department name inquiry 
        try {
            const [dept] = await connection.promise().query(`SELECT department_id FROM departments WHERE name = ?`, [answer.department])
            //create new role
            connection.promise().query(`INSERT INTO roles(title, salary, department_id) VALUES (?,?,?)`, [answer.name, answer.salary, dept[0].department_id])

            showRoles()
            init()
        }
        catch (error) {
            throw new Error(error)
        }
    })
}
const addEmployee = async () => {
    //select all roles and all first names from employees
    connection.query(`SELECT title FROM roles; SELECT first_name FROM employees`, async (err, res) => {
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "Enter the first name of the new employee"
            },
            {
                type: "input",
                name: "lastName",
                message: "Enter the last name of the new employee"
            },
            {
                type: "list",
                name: "role",
                message: "What is the role of the new employee?",
                choices: res[0].map(role => role.title)
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the manager for the new employee",
                choices: res[1].map(employees => employees.first_name)
            }
        ])
        //get role ids....again
        try {
            const [role] = await connection.promise().query(`SELECT role_id FROM roles WHERE title = ?`, [answers.role])
            //get employee ids.....again
            const [manager] = await connection.promise().query(
                `SELECT employee_id 
                FROM employees 
                WHERE first_name = ?`, [answers.manager])

            console.log(manager)
            //create new employee 
            await connection.promise().query(
                `INSERT INTO employees
                (first_name, last_name, role_id, manager_id )
                 VALUES (?,?,?,?)`,
                [answers.firstName, answers.lastName, role[0].role_id, manager[0].employee_id])

            showEmployees()
            init()
        }
        catch (error) {
            throw new Error(error)
        }
    })
}
const updateEmployeeRole = async () => {
    //get employee full name
    try {
        const [employeeNames] = await connection.promise().query(
            `SELECT 
            CONCAT (employees.first_name, ' ', employees.last_name) AS name
            FROM employees`)
        //get roles again
        const [roles] = await connection.promise().query(
            `SELECT roles.title FROM roles`
        )
        const answers = await inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which Employee would you like to update?",
                choices: employeeNames.map(employee => employee.name)
            },
            {
                type: "list",
                name: "role",
                message: "What role should this Employee be moved to?",
                choices: roles.map(role => role.title)
            }
        ])
        //get role ids again
        const [role] = await connection.promise().query(`SELECT role_id FROM roles WHERE title = ?`, [answers.role])
        //update employee role 
        await connection.promise().query(`UPDATE employees SET role_id = ? WHERE CONCAT (employees.first_name, ' ', employees.last_name) = ?`, [role[0].role_id, answers.employee])

        showEmployees()
        init()
    }
    catch (error) {
        throw new Error(error)
    }
}
const deleteEmployee = async () => {
    //select employee full name again....
    const [results] = await connection.promise().query(
        `SELECT 
    CONCAT (employees.first_name, ' ', employees.last_name) AS name
    FROM employees`)

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: "Which employee would you like to remove?",
            choices: results.map(employee => employee.name)
        }
    ])
    try {
        connection.promise().query(`DELETE FROM employees WHERE CONCAT (employees.first_name, ' ', employees.last_name) = ?`, [answer.employee])
    }
    catch (error) {
        throw new Error(error)
    }
    showEmployees()
    init()
}
const sumSalaries = async () => {
    const [results] = await connection.promise().query(`SELECT name FROM departments`)

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message:"Which departments total salaries would you like to view?",
            choices: results.map(department => department.name)
        }
    ])
    const [dept] = await connection.promise().query(`SELECT department_id FROM departments WHERE name = ?`, [answers.department])
console.log(dept[0].department_id)
    try{
       const [results] = await connection.promise().query(
            `SELECT SUM(salary) 
            FROM roles
            WHERE department_id = ?`, [dept[0].department_id])
        console.table(results)
        init()
    }
    catch(error){
        throw new Error(error)
    }
}
const exit = async () => {
    //exit program...same as ctrl+c
    process.kill(process.pid, "SIGINT");
}

//what to do map?
const mapActions = {
    'View all Employees': showEmployees,
    'View all Roles': showRoles,
    'View all Departments': showDepartments,
    'Add new Employee': addEmployee,
    'Add new Department': addDepartment,
    'Add a new Role': addRole,
    'Update an Employee': updateEmployeeRole,
    'Delete an Employee': deleteEmployee,
    'View total Salaries by department': sumSalaries,
    'Exit': exit
}
//start
const init = async () => {
    let answer = await inquirer.prompt([{
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: Object.keys(mapActions)
    }])
    mapActions[answer.action]()
}

init()