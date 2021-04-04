const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql');
const cTable = require('console.table');
const questions = require('../questions');
const util = require('util');

// set up mysql connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '955503Sc!',
    database: 'employeeDB'
});

connection.query = util.promisify(connection.query);

function findAllEmployees() {
    return connection.query('SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id')
}
function findAllDepartments() {
    return connection.query('SELECT department.id, department.name FROM department LEFT JOIN roles ON roles.department_id = department.id LEFT JOIN employee ON employee.role_id = roles.id GROUP BY department.id, department.name')
}
function findAllRoles() {
    return connection.query('SELECT roles.id, roles.title, roles.salary, department.name FROM roles LEFT JOIN department ON roles.department_id = department.id')
}

// addEmployee function prompts user for employee info and INSERTS into db
function addEmployee() {
    inquirer.prompt(questions.employeeQuestions).then(response => {
        findAllRoles().then(data => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeRole',
                    message: 'What is the employee role title',
                    choices: data.map(roleData => roleData.title)
                }
            ]).then(({ employeeRole }) =>
                connection.query('INSERT INTO employee SET ?',
                    {
                        first_name: response.firstName,
                        last_name: response.lastName,
                        role_id: data.filter(roleData => roleData.title === employeeRole)[0].id,
                        manager_id: 1
                    },
                    (err) => {
                        if (err) throw err;
                        console.log('\x1b[32m%s\x1b[0m', `${response.firstName.concat(" ", response.lastName)} was added as an employee successfully`);
                        init();
                    })
            )
        })
    });
}

// addRole function prompts user for role info and INSERTS into db
function addRole() {
    inquirer.prompt(questions.roleQuestions).then(response => {
        findAllDepartments().then(data => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'roleDepartment',
                    message: 'To what department does the role belong',
                    choices: data.map(departmentData => departmentData.name)
                }
            ]).then(({ roleDepartment }) =>
                connection.query('INSERT INTO roles SET ?',
                    {
                        title: response.roleTitle,
                        salary: response.salary,
                        department_id: data.filter(departmentData => departmentData.name === roleDepartment)[0].id,
                    },
                    (err) => {
                        if (err) throw err;
                        console.log('\x1b[32m%s\x1b[0m', `The ${response.roleTitle} role was added successfully`);
                        init();
                    })
            )
        })

    });
}

// addDepartment function prompts user for department info and INSERTS into db
function addDepartment() {
    inquirer.prompt(questions.departmentQuestions).then(response => {
        connection.query('INSERT INTO department SET ?',
            {
                name: response.department
            },
            (err) => {
                if (err) throw err;
                console.log('\x1b[32m%s\x1b[0m', `The ${response.department} department was successfully added`);
                findAllDepartments().then(data => {
                    console.table(data);
                    init();
                })
            });
    });
}

function removeEmployee() {
    findAllEmployees().then(data => {
        inquirer.prompt([
            {
                type: 'list',
                name: 'removeEmployee',
                message: 'Select an employee to remove',
                choices: data.map(employeeData => employeeData.first_name.concat(" ", employeeData.last_name))
            }
        ]).then(({ removeEmployee }) =>

            connection.query('DELETE FROM employee WHERE ?',
                {
                    id: data.filter(employeeData => {
                        if(employeeData.first_name === removeEmployee.split(" ")[0] && employeeData.last_name === removeEmployee.split(" ")[1]){
                            return true
                        }
                    })[0].id,
                },
                (err) => {
                    if (err) throw err;
                    console.log('\x1b[32m%s\x1b[0m', `${removeEmployee} was successfully removed`);
                    init();
                })
            )
        });
}

// initiate function prompts the user what action they would like to perform
function init() {
    console.log('---------------------------------------\n');
    inquirer.prompt(questions.initQuestions).then(response => {
        if (response.userChoice === 'View all employees') {
            findAllEmployees().then(data => {
                console.table(data);
                init();
            })
        } else if (response.userChoice === 'View all roles') {
            findAllRoles().then(data => {
                console.table(data);
                init();
            })
        } else if (response.userChoice === 'View all departments') {
            findAllDepartments().then(data => {
                console.table(data);
                init();
            })
        } else if (response.userChoice === 'View all employees by department') {
            console.log('This should display employees by department')
        } else if (response.userChoice === 'View all employees by manager') {
            console.log('This should display employees by manager')
        } else if (response.userChoice === 'Add a department') {
            addDepartment();
        } else if (response.userChoice === 'Add an employee role') {
            addRole();
        } else if (response.userChoice === 'Add an employee') {
            addEmployee();
        } else if (response.userChoice === 'Remove an employee') {
            removeEmployee();
        } else if (response.userChoice === 'Update an employee') {
        } else {
            console.log('\x1b[31m%s\x1b[0m', '\nProgram ended\n');
            process.exit(1);
        }
    })
}

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    init();
});



