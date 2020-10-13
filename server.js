const mysql = require('mysql');
const inquirer = require('inquirer');

var connection = mysql.createConnection(
    {
        host: "localhost",

        port: 3306,

        user: "root",

        password: "password",
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
        switch (answer.intitialQuestions) {
            case "Add departments, roles, employees":
                addFunc();
                break;

            case "View departments, roles, employees":
                viewFunc();
                break;

            case "Update employee roles":
                updateFunc();
                break;

            case "Exit":
                connection.end();
        }
    });  
};
function viewFunc() {
    inquirer   
        .prompt({
            name: "viewWhich",
            type: "list",
            message: "Select what you would like to view",
            choices: [
                "Departments",
                "Roles",
                "Employees"
            ]
        })
        .then((answer) => {
            switch (answer.viewWhich) {
                case "Departments":
                    viewDepartmentFunc();
                    break;

                case "Roles":
                    viewRolesFunc();
                    break;

                case "Employees":
                    viewEmployeesFunc()
                    break;
            };
        });
};
function viewDepartmentFunc() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        if (res === []) {console.log("There are no departments to view.")};
        console.log(res);
        chooseRole();
    });
};
function viewRolesFunc() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        if (res === []) {console.log("There are no roles to view.")};
        console.log(res);
        chooseRole();
    });
};
function viewEmployeesFunc() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        if (res === []) {console.log("There are no employees to view.")};
        console.log(res);
        chooseRole();
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
        .then((answer) => {
            switch (answer.departmentRoleEmployee) {
                case "Department":
                    addDepartmentFunc();
                    break;

                case "Role":
                    addRoleFunc();
                    break;

                case "Employee":
                    addEmployeeFunc();
                    break;
            }
        });
};
function hasManagerFunc() {
    inquirer
        .prompt([
            {
                name: "employeeFirstName",
                type: "input",
                message: "What is the first name of the employee?"
            },
            {
                name: "employeeLastName",
                type: "input",
                message: "What is the last name of the employee?"
            },
            {
                name: "managerid",
                type: "input",
                message: "What is the manager id for this employee?"
            }
        ])
}
function noManagerFunc() {
    inquirer
        .prompt([
            {
                name: "employeeFirstName",
                type: "input",
                message: "What is the first name of the employee?"
            },
            {
                name: "employeeLastName",
                type: "input",
                message: "What is the last name of the employee?"
            }
        ])
        .then((result) => {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    id: result.id,
                    first_name: result.employeeFirstName,
                    last_name: result.employeeLastName,
                    role_id: result.role_id,
                    manager_id: null
                }
            )
        })
}
function addEmployeeFunc() {
    connection.query(
        "SELECT * FROM role",
        function(err, res) {
            let roleID;
            let roleArray = []
            for(let i = 0; i < res.length; i++) {
                roleArray.push(res[i].title)
                roleID = res[i].id
            }
            if (err) throw err;
            console.log(res)
            inquirer
                .prompt([
                    {
                        name: "whichrole",
                        type: "list",
                        message: "Which role would you like to add an employee to?",
                        choices: roleArray
                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Does this employee have a manager?",
                        choices: ["Yes", "No"]
                    }
                ])
                .then((response) => {
                    if (response.manager === "No") {
                        noManagerFunc()
                    } else {
                        hasManagerFunc()
                    };
                })
        }
    )
}
function addRoleFunc() {
    connection.query(
        "SELECT * FROM department",
        function(err, res) {
            if (err) throw err
            console.log(res)
            inquirer
                .prompt([
                    {
                    name: "whichdepartment",
                    type: "list",
                     message: "Select which department you would like to add a role to.",
                    choices: res
                    },
                    {
                    name: "title",
                    type: "input",
                    message: "Please input the role you would like to add."
                    },
                    {
                    name: "salary",
                    type: "input",
                    message: "Input the persons salary."
                    }
                ])
                .then((result) => {
                    let departmentID;
                    console.log(res)
                    for (let i = 0; i < res.length; i++) {
                        departmentID = res[i].id
                    };
                    console.log(result);
                    connection.query(
                        "INSERT INTO role SET ?",
                        {
                            id: result.id,
                            title: JSON.stringify(result.title),
                            salary: result.salary,
                            department_id: departmentID
                        },
                        function(err, res) {
                            if (err) throw err
                        }
                    );
                    console.log(result)
                    chooseRole()
                });
            });
        
}

function addDepartmentFunc() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "Please input the department you would like to add."
        })
        .then((res) => {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    id: res.id,
                    name: JSON.stringify(res.department)
                },
                function(err, res) {
                    if (err) throw err
                }
            );
            console.log(res)
            chooseRole()
        });
};