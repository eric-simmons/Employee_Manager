

const departmentQuestions = [{
    type: "input",
    name: "department",
    message: "Enter the name of the Department you would like to add"

}]

const employeeQuestions = [
{
    type: "input",
    name: "firstName",
    message: "Enter the first name of the employee"

},
{
    type: "input",
    name: "lastName",
    message: "Enter the last name of the employee"
}
]

const roleQuestions = [
{
    type: "input",
    name: "role",
    message: "Enter the name of the Role you would like to add"

}]

const updateQuestions = [
{
    type: "input",
    name: "updateEmployee",
    message: "Enter the name of the employee you would like to update"

}
]

module.exports = { departmentQuestions, employeeQuestions, roleQuestions, updateQuestions }