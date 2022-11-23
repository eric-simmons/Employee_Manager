
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database



require('dotenv').config()
const inquirer = require('inquirer')
const cTable = require('console.table')
const connection = require('./config/connection.js')
const { departmentQuestions, employeeQuestions, roleQuestions, updateQuestions } = require('./lib/questions.js')
const process = require('process')



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
                employees.first_name,
                employees.last_name,
                employees.manager_id,
                roles.title,
                roles.salary,
                departments.name as department
            FROM employees
            INNER JOIN roles ON employees.role_id=roles.role_id
            INNER JOIN departments ON roles.department_id=departments.department_id
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
    console.log(answer)
    try{
        await connection.promise().query(
            `INSERT INTO departments(name) VALUES (?)`, [answer.name]
        )
        showDepartments()
    }
    catch(error){
        throw new Error(error)
    }
}
const exit = async () => {
    process.kill(process.pid, "SIGINT");
}
const addEmployee = async () => {

    connection.query(`SELECT * FROM roles`, async (err, res) => {
        console.log(res)
        const roleOptions = res.map(role => role.title)
    })


    //     const answers = await inquirer.prompt([
    //         {
    //             type: "input",
    //             name: "firstName",
    //             message: "Enter the first name of the employee"

    //         },
    //         {
    //             type: "input",
    //             name: "lastName",
    //             message: "Enter the last name of the employee"
    //         },
    //         {
    //             type: "list",
    //             name: "role",
    //             choices: res.map(role => role.title)
    //         }
    //         // {
    //         //     type: 'list',
    //         //     name: "department",
    //         //     choices: departmentChoices
    //         // }
    //     ])
    // })
    // try {








    //     init()
    // }
    // catch (error) {
    //     throw new Error(error)
    // }

}

const mapActions = {
    'View all Employees': showEmployees,
    'View all Roles': showRoles,
    'View all Departments': showDepartments,
    //'Add new Employee': addEmployee,
     'Add new Department' : addDepartment,
    // 'Add a new Role' : addRole,
    'Exit': exit

}

const init = async () => {
    let answer = await inquirer.prompt([{
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: Object.keys(mapActions)
    }])
    // console.log(answer)
    console.log(mapActions[answer.action])
    mapActions[answer.action]()
}

init()