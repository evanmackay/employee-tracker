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
function updateFunc() {
    connection.query("SELECT e.first_name, e.last_name, r.title FROM employee AS e LEFT JOIN role AS r ON e.role_id = r.id;", function(err, res) {
        console.log(res)
        
        let updateRolesArray = []
        for (let i = 0; i < res.length; i++) {
            updateRolesArray.push(res[i].title)
        }
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "updateWhich",
                    type: "list",
                    message: "Select what employee role you would like to update.",
                    choices: updateRolesArray
                }
            ])
            .then((result) => {
                let updateEmployeeArray = []
                    for (let j = 0; j < updateRolesArray.length; j++) {
                        if (res[j].title === result.updateWhich) {
                            updateEmployeeArray.push(res[j].last_name)
                        }
                    }
                    console.log(updateEmployeeArray)
                    function updateEmployee() {
                        inquirer
                            .prompt([
                                {
                                    name: "selectName",
                                    type: "list",
                                    message: "Select the lastname of the employee you would like to update.",
                                    choices: updateEmployeeArray
                                },
                                {
                                    name: "enterInfoFirstName",
                                    type: "input",
                                    message: "Enter the updated first name."
                                },
                                {
                                    name: "enterInfoLastName",
                                    type: "input",
                                    message: "Enter the updated last name."
                                },
                                {
                                    name: "hasManager",
                                    type: "list",
                                    message: "Does the employee have a manager still?",
                                    choices: ["Yes", "No"]
                                }
                            ])
                            .then((response) => {
                                let managerID;
                                if (response.hasManager === "No") {
                                    managerID = null
                                }
                                connection.query("UPDATE employee SET ? WHERE ?",
                                [{
                                    first_name: response.enterInfoFirstName,
                                    last_name: response.enterInfoLastName,
                                    manager_id: managerID
                                },
                                {
                                    last_name: response.selectName
                                }])
                                chooseRole();
                            })
                    }
                    updateEmployee()
                
            })
    })

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
        if (res === []) {
            console.log("There are no departments to view.")
        } else {
            console.log(res);
            chooseRole();
        };
    });
};
function viewRolesFunc() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        if (res === []) {
            console.log("There are no roles to view.")
        } else {
            console.log(res);
            chooseRole();
        };
    });
};
function viewEmployeesFunc() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        if (res === []) {
            console.log("There are no employees to view.")
        } else {
            console.log(res);
            chooseRole();
        };
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

function addEmployeeFunc() {
    connection.query(
        "SELECT * FROM role",
        function(err, res) {
            let roleArray = []
            for(let i = 0; i < res.length; i++) {
                roleArray.push(res[i].title)
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
                    },
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
                .then((response) => {
                    let roleID;
                    let hasManager;
                    console.log(res)
                    switch (response.manager) {
                        case "No": 
                            hasManager = null
                            break;
                        
                        // case "Yes": 
                        // hasManager = 
                    }
                    for (let i = 0; i < roleArray.length; i++) {
                        if (res[i].title === response.whichrole) {
                            roleID = res[i].id
                        }
                    };
                    connection.query("INSERT INTO employee SET ?",
                    {
                        id: response.id,
                        first_name: response.employeeFirstName + "",
                        last_name: response.employeeLastName + "",
                        role_id: roleID,
                        manager_id: hasManager
                    })
                    chooseRole()
                })
        }
    )
}
function addRoleFunc() {
    connection.query(
        "SELECT * FROM department",
        function(err, res) {
            if (err) throw err;
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
                        if (res[i].name === result.whichdepartment) {
                            departmentID = res[i].id
                        }
                    };
                    console.log(result);
                    console.log(departmentID)
                    connection.query(
                        "INSERT INTO role SET ?",
                        {
                            id: result.id,
                            title: result.title + "",
                            salary: result.salary,
                            department_id: departmentID
                        },
                        function(err, res) {
                            if (err) throw err
                        }
                    );
                    // console.log(result)
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
                    name: res.department + ""
                },
                function(err, res) {
                    if (err) throw err
                }
            );
            console.log(res)
            chooseRole()
        });
};