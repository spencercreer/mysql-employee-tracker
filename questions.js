const initQuestions = [
    {
        type: 'list',
        name: 'userChoice',
        message: ' What would you like to do?',
        choices: ['View all employees', 'View all roles', 'View all departments', 'View all employees by department', 'View all employees by manager', 'Add a department', 'Add an employee role', 'Add an employee', 'Remove an employee', 'Update an employee', 'Quit program'],
    },
]
const employeeQuestions = [
    {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
        validate: answer => {
            if (answer !== '') {
                return true
            } else {
                return "Please enter the employee's name."
            }
        },
    },
    {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: answer => {
            if (answer !== '') {
                return true
            } else {
                return "Please enter the employee's name."
            }
        },
    },
    {
        type: 'list',
        name: 'isManager',
        message: 'Is the employee a manager?',
        choices: ['Yes','No'],
      },
]
const roleQuestions = [
    {
        type: 'input',
        name: 'roleTitle',
        message: "What is the role title?",
        validate: answer => {
            if (answer !== '') {
                return true
            } else {
                return "Please enter the role title."
            }
        },
    },
    {
        type: 'input',
        name: 'salary',
        message: "What is the role salary?",
        validate: answer => {
            if (answer !== '') {
                return true
            } else {
                return "Please enter the role salary."
            }
        },
    },
]
const departmentQuestions = [
    {
        type: 'input',
        name: 'department',
        message: "What is the department?",
        validate: answer => {
            if (answer !== '') {
                return true
            } else {
                return "Please enter the department."
            }
        },
    },
]
const removeEmployeeQuestions = [
    {
        type: 'input',
        name: 'department',
        message: "What is the department?",
        validate: answer => {
            if (answer !== '') {
                return true
            } else {
                return "Please enter the department."
            }
        },
    },
]

module.exports = {
    initQuestions, employeeQuestions, roleQuestions, departmentQuestions, removeEmployeeQuestions
}