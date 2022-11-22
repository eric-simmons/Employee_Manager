require('dotenv').config()
const inquirer = require('inquirer')
const cTable = require('console.table')
const connection = require('./config/connection.js')
const { initQuestion, departmentQuestions, employeeQuestions } = require('./lib/questions.js')




const showRoles = async () => {
    try {
        const [results] = await connection.promise().query(`SELECT * FROM roles`)
        console.table(results)
        init()
    }
    catch (error) {
        throw new Error(error)
    }
}

const showEmployees = async () => {
    try {
        const [results] = await connection.promise().query(`SELECT * FROM employees`)
        console.table(results)
        init()
    }
    catch (error) {
        throw new Error(error)
    }
}

const mapActions = {
    'View all Employees': showEmployees,
    'View all Roles' : showRoles,
}

const init = async () => {
    let answer = await inquirer.prompt([{
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: Object.keys(mapActions)
    }])
    console.log(answer)
    console.log(mapActions[answer.action])
    mapActions[answer.action]()
}

init()