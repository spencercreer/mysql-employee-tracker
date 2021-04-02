const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql');
const cTable = require('console.table');
const questions = require('./questions')

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '955503Sc!',
    database: 'employeeDB'
});

function addEmployee() {
    inquirer.prompt(questions.employeeQuestions).then(response => {
        connection.query('INSERT INTO employee SET ?', 
        {
            first_name: response.firstName,
            last_name: response.lastName,
            role_id: 1,
            manager_id: 1
        },
        (err) => {
            if (err) throw err;
            console.log('Your employee was added successfully');
            init();
        });
    });
}

function addRole() {
    inquirer.prompt(questions.roleQuestions).then(response => {
        connection.query('INSERT INTO roles SET ?', 
        {
            title: response.roleTitle,
            salary: response.salary
        },
        (err) => {
            if (err) throw err;
            console.log('Your role was added successfully');
            init();
        });
    });
}

function addDepartment() {
    inquirer.prompt(questions.departmentQuestions).then(response => {
        connection.query('INSERT INTO department SET ?', 
        {
            name: response.department
        },
        (err) => {
            if (err) throw err;
            console.log('Your department was added successfully');
            init();
        });
    });
}

function displayTable() {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
}

function init() {
    console.log('\n---------------------------------------\n');
    inquirer.prompt(questions.initQuestions).then(response => {
        if (response.userChoice === 'View all employees') {
            console.log('\n---------------------------------------\n');
            displayTable();
        } else if (response.userChoice === 'View all employees by department') {
            console.log('\n---------------------------------------\n');
            displayTable();
        } else if (response.userChoice === 'View all employees by manager') {
            console.log('\n---------------------------------------\n');
            displayTable();
        } else if (response.userChoice === 'Add a department') {
            console.log('\n---------------------------------------\n');
            addDepartment();
        } else if (response.userChoice === 'Add an employee role') {
            console.log('\n---------------------------------------\n');
            addRole();
        } else if (response.userChoice === 'Add an employee') {
            console.log('\n---------------------------------------\n');
            addEmployee();
        } else if (response.userChoice === 'Remove an employee') {
            console.log('\n---------------------------------------\n');
        } else if (response.userChoice === 'Update an employee') {
            console.log('\n---------------------------------------\n');
        } else {
            console.log('\nProgram ended\n');
            process.exit(1);
        }
    })
}

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    init();
});



