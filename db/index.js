const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql');
const cTable = require('console.table');
const questions = require('../questions');
const util = require('util');
require('dotenv').config({path: "../.env"})

// set up mysql connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.PASSWORD,
    database: 'employeeDB'
});

connection.query = util.promisify(connection.query);

// findAll functions query mysql for employees, roles, and departments
function findAllEmployees() {
    return connection.query('SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager, employee.is_manager FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id')
}
function findAllManagers() {
    // return connection.query('SELECT employee.id, is_manager FROM employee')
    return findAllEmployees().then(employeeData => {
        return employeeData.filter(data => data.is_manager)
    })
}

function findAllRoles() {
    return connection.query('SELECT roles.id, roles.title, roles.salary, department.name FROM roles LEFT JOIN department ON roles.department_id = department.id')
}
function findAllDepartments() {
    return connection.query('SELECT department.id, department.name, SUM(roles.salary) AS utilized_budget FROM department LEFT JOIN roles ON roles.department_id = department.id LEFT JOIN employee ON employee.role_id = roles.id GROUP BY department.id, department.name')
}

// addEmployee function prompts user employee questions and INSERTS into mysql db
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
            ]).then(({ employeeRole }) => {
                findAllManagers().then(managerData => {
                    let managerArray = managerData.map(managerData => managerData.first_name.concat(' ', managerData.last_name));
                    managerArray.unshift('None');
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'employeeManager',
                            message: "Who is the employee's manager?",
                            choices: managerArray
                        }
                    ]).then(({ employeeManager }) =>
                        connection.query('INSERT INTO employee SET ?',
                            {
                                first_name: response.firstName,
                                last_name: response.lastName,
                                role_id: data.filter(roleData => roleData.title === employeeRole)[0].id,
                                manager_id: employeeManager === 'None' ? 0 : managerData.filter(managerData => {
                                    console.log(managerData);
                                    if (managerData.first_name === employeeManager.split(" ")[0] && managerData.last_name === employeeManager.split(" ")[1]) {
                                        return true
                                    }
                                })[0].id,
                                is_manager: response.isManager === 'Yes' ? true : false
                            },
                            (err) => {
                                if (err) throw err;
                                console.log('\x1b[32m%s\x1b[0m', `${response.firstName.concat(" ", response.lastName)} was successfully added as an employee`);
                                findAllEmployees().then(data => {
                                    console.table(data);
                                    init();
                                })
                            })
                    )
                })
            })
        })
    })
}

// addRole function prompts user roleQuestions and INSERTS into db mysql
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
                        findAllRoles().then(data => {
                            console.table(data);
                            init();
                        })
                    })
            )
        })

    });
}

// addDepartment function prompts user departmentQuestions and INSERTS into mysql db
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

// removeEmployee function prompts user to select an employee to delete from the mysql db
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
                        if (employeeData.first_name === removeEmployee.split(" ")[0] && employeeData.last_name === removeEmployee.split(" ")[1]) {
                            return true
                        }
                    })[0].id,
                },
                (err) => {
                    if (err) throw err;
                    console.log('\x1b[32m%s\x1b[0m', `${removeEmployee} was successfully removed`);
                    findAllEmployees().then(data => {
                        console.table(data);
                        init();
                    })
                })
        )
    });
}

// updateEmployee function prompts user to select an employee to update in the mysql db
function updateEmployee() {
    findAllEmployees().then(findAllEmployeeResponse => {
        inquirer.prompt([
            {
                type: 'list',
                name: 'updateEmployee',
                message: 'Select an employee to update',
                choices: findAllEmployeeResponse.map(employeeData => employeeData.first_name.concat(" ", employeeData.last_name))
            }
        ]).then(({ updateEmployee }) => {
            inquirer.prompt(questions.employeeQuestions).then(response => {
                findAllRoles().then(findAllRolesResponse => {
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'employeeRole',
                            message: 'What is the employee role title',
                            choices: findAllRolesResponse.map(roleData => roleData.title)
                        }
                    ]).then(({ employeeRole }) => {
                        findAllManagers().then(managerData => {
                            let managerArray = managerData.map(managerData => managerData.first_name.concat(' ', managerData.last_name));
                            managerArray.unshift('None');
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'employeeManager',
                                    message: "Who is the employee's manager?",
                                    choices: managerArray
                                }
                            ]).then(({ employeeManager }) =>
                                connection.query('UPDATE employee SET ? WHERE ?',
                                    [
                                        {
                                            first_name: response.firstName,
                                            last_name: response.lastName,
                                            role_id: findAllRolesResponse.filter(roleData => roleData.title === employeeRole)[0].id,
                                            manager_id: employeeManager === 'None' ? 0 : managerData.filter(managerData => {
                                                console.log(managerData);
                                                if (managerData.first_name === employeeManager.split(" ")[0] && managerData.last_name === employeeManager.split(" ")[1]) {
                                                    return true
                                                }
                                            })[0].id,
                                            is_manager: response.isManager === 'Yes' ? true : false
                                        },
                                        {
                                            id: findAllEmployeeResponse.filter(employeeData => {
                                                if (employeeData.first_name === updateEmployee.split(" ")[0] && employeeData.last_name === updateEmployee.split(" ")[1]) {
                                                    return true
                                                }
                                            })[0].id,
                                        },
                                    ],
                                    (err) => {
                                        if (err) throw err;
                                        console.log('\x1b[32m%s\x1b[0m', `${response.firstName.concat(" ", response.lastName)} was successfully updated`);
                                        findAllEmployees().then(data => {
                                            console.table(data);
                                            init();
                                        })
                                    })
                            )
                        })
                    })
                })
            })
        })
    })
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
                    } else if (response.userChoice === 'View all managers') {
                        findAllManagers().then(data => {
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
                        findAllDepartments().then(data => {
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'viewDepartment',
                                    message: 'Select a department',
                                    choices: data.map(departmentData => departmentData.name)
                                }
                            ]).then(({ viewDepartment }) =>
                                connection.query('SELECT department.name AS department, employee.first_name, employee.last_name, employee.id, roles.title, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager, employee.is_manager FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id WHERE ?',
                                    {
                                        name: viewDepartment,
                                    }).then(data => {
                                        console.table(data);
                                        init();
                                    })
                            )
                        })
                    } else if (response.userChoice === 'View all employees by manager') {
                        findAllManagers().then(data => {
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'viewManager',
                                    message: 'Select a manager',
                                    choices: data.map(managerData => managerData.first_name.concat(' ', managerData.last_name))
                                }
                            ]).then(({ viewManager }) =>
                                connection.query('SELECT employee.id, employee.first_name, employee.last_name FROM employee WHERE ?',
                                    {
                                        manager_id: data.filter(managerData => {
                                            if (managerData.first_name === viewManager.split(" ")[0] && managerData.last_name === viewManager.split(" ")[1]) {
                                                return true
                                            }
                                        })[0].id,
                                    }).then(data => {
                                        console.table(data);
                                        init();
                                    })
                            )
                        })
                    } else if (response.userChoice === 'Add a department') {
                        addDepartment();
                    } else if (response.userChoice === 'Add an employee role') {
                        addRole();
                    } else if (response.userChoice === 'Add an employee') {
                        addEmployee();
                    } else if (response.userChoice === 'Remove an employee') {
                        removeEmployee();
                    } else if (response.userChoice === 'Update an employee') {
                        updateEmployee();
                    } else {
                        console.log('\x1b[31m%s\x1b[0m', '\nProgram ended\n');
                        process.exit(1);
                    }
                })
            }

// connect mysql connection
connection.connect((err) => {
                if (err) throw err;
                console.log(`connected as id ${connection.threadId}`);
                init();
            });



