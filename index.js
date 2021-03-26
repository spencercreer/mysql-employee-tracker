const inquirer = require('inquirer');
const fs = require('fs');
const cTable = require('console.table')

const questions = [
    {
        type: 'list',
        name: 'employeeType',
        message:' What would you like to do?',
        choices: ['View all employees', 'View all employees by department', 'View all employees by manager', 'Add a department', 'Add an employee role', 'Add an employee', 'Remove an employee', 'Update an employee'],
    },
    { 
        type:'input',
        name:'managerName',
        message:"What is the manager's name?",
        validate: answer =>{
            if(answer!==''){
                return true
            } else{
                return "Please enter the manager's name."
            }
        },
    },
]

inquirer.prompt(questions).then((response) => console.table(response))

