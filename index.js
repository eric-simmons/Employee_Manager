


// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database



require('dotenv').config()
const inquirer = require('inquirer')
require('console.table')
const connection = require('./config/connection.js')
const process = require('process')
const { query } = require('./config/connection.js')



const showDepartments = async () => {
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

        try {
            const [dept] = await connection.promise().query(`SELECT department_id FROM departments WHERE name = ?`, [answer.department])

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
        try {
            const [role] = await connection.promise().query(`SELECT role_id FROM roles WHERE title = ?`, [answers.role])

            const [manager] = await connection.promise().query(
                `SELECT employee_id 
                FROM employees 
                WHERE first_name = ?`, [answers.manager])

            console.log(manager)

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
const exit = async () => {
    process.kill(process.pid, "SIGINT");
}

const mapActions = {
    'View all Employees': showEmployees,
    'View all Roles': showRoles,
    'View all Departments': showDepartments,
    'Add new Employee': addEmployee,
    'Add new Department': addDepartment,
    'Add a new Role': addRole,
    'Exit': exit
}

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