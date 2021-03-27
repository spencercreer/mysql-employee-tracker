const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql');
const cTable = require('console.table');

var connection = mysql.createConnection({
    host     : 'localhost',
    port: 3306,
    user: 'root',
    password : '955503Sc!',
    database : 'employeeDB'
});


const initQuestions = [
    {
        type: 'list',
        name: 'userChoice',
        message:' What would you like to do?',
        choices: ['View all employees', 'View all employees by department', 'View all employees by manager', 'Add a department', 'Add an employee role', 'Add an employee', 'Remove an employee', 'Update an employee'],
    },
]
const employeeQuestions = [
    { 
        type:'input',
        name:'firstName',
        message:"What is the employee's first name?",
        validate: answer =>{
            if(answer!==''){
                return true
            } else{
                return "Please enter the employee's name."
            }
        },
    },
    { 
        type:'input',
        name:'lastName',
        message:"What is the employee's last name?",
        validate: answer =>{
            if(answer!==''){
                return true
            } else{
                return "Please enter the employee's name."
            }
        },
    },
]
const roleQuestions = [
    { 
        type:'input',
        name:'roleTitle',
        message:"What is the role title?",
        validate: answer =>{
            if(answer!==''){
                return true
            } else{
                return "Please enter the role title."
            }
        },
    },
    { 
        type:'input',
        name:'salary',
        message:"What is the role salary?",
        validate: answer =>{
            if(answer!==''){
                return true
            } else{
                return "Please enter the role salary."
            }
        },
    },    
]
const departmentQuestions = [
    { 
        type:'input',
        name:'department',
        message:"What is the department?",
        validate: answer =>{
            if(answer!==''){
                return true
            } else{
                return "Please enter the department."
            }
        },
    },
]

function addEmployee(){
    inquirer.prompt(employeeQuestions).then(response => console.table(response))
}

function addRole(){
    inquirer.prompt(roleQuestions).then(response => console.table(response))
}

function addDepartment(){
    inquirer.prompt(departmentQuestions).then(response => console.table(response))
}

function displayTable(){
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
    });
    
    // console.table(response)
}

function init(){
    inquirer.prompt(initQuestions).then(response => {
        if(response.userChoice === 'View all employees'){
            console.log('View all employees');
            displayTable();
        } else if(response.userChoice === 'View all employees by department'){
            console.log('View all employees by department');
        } else if(response.userChoice === 'View all employees by manager'){
            console.log('View all employees by manager');
        } else if(response.userChoice === 'Add a department'){
            console.log('Add a department');
            addDepartment();
        } else if(response.userChoice === 'Add an employee role'){
            console.log('Add an employee role');
            addRole();
        } else if(response.userChoice === 'Add an employee'){
            console.log('Add an employee');
            addEmployee();
        } else if(response.userChoice === 'Remove an employee'){
            console.log('Remove an employee');
        } else if(response.userChoice === 'Update an employee'){
            console.log('Update an employee');
        } 
    })
}

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    init();
  });



