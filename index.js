require('dotenv').config()
const inquirer = require('inquirer')
const cTable = require('console.table')
const connection = require('./config/connection.js')
const { initQuestion, departmentQuestions, employeeQuestions } = require('./lib/questions.js')


const init = async () => {
    let answer = await inquirer.prompt(initQuestion)

    if (answer.action === "View all Employees") {
        showEmployees()
    }

}
init()


const showEmployees = async () => {
    try {
        const [results] = await connection.promise().query(`SELECT * FROM employees`)
        console.table(results)
    }
    catch (error) {
        throw new Error(error)
    }
}