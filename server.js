const mysql = require('mysql');
const inquirer = require('inquirer');

var connection = mysql.createConnection(
    {
        host: "localhost",

        port: 3306,

        user: "root",

        passwor: "password",
        database: "employee_DB"
    });
connection.connect(function(err) {
    if (err) throw err;
    chooseRole();
});

function chooseRole() {
  inquirer
    .prompt({
        name: 'intitialQuestions',
        type: "list",
        message: "Please select what you would like to do.",
        choices: [
            "Add departments, roles, employees",
            "View departments, roles, employees",
            "Update employee roles",
            "Exit"
        ]
    })
    .then((answer) => {
        switch (answer.action) {
            case answer == answer.choices[0]:
                addFunc();
                break;

            case answer == answer.choices[1]:
                viewFunc();
                break;

            case answer == answer.choices[2]:
                updateFunc();
                break;

            case answer == answer.choices[3]:
                connection.end();
        }
    });  
};

function addFunc() {
    inquirer
        .prompt({
            name: "departmentRoleEmployee",
            type: "list",
            message: "Select what you would like to add.",
            choices: [
                "Department",
                "Role",
                "Employee"
            ]
        })
        .then()
};