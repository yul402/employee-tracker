const inquirer = require("inquirer");
const mysql = require('mysql2');
// const promptAddDepartment = require('./prompt/addDepartment');
// const promptAddRole = require('./prompt/addRole');
// const promptAddEmployee = require('./prompt/addEmployee');
// const promptUpdateEmployee = require('./prompt/updateEmployee');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'MLy6419649211_',
      database: 'employee_tracker_db'
    },
    console.log(`Connected to the employee_tracker_db database.`)
  );

  function promptAddDepartment(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?',
            validate: (departmentInput) => {
                if (departmentInput) {
                    return true;
                } else {
                    console.log('Please Add A Department!');
                    return false;
                }}
        }
    ]).then((answers) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, results) => {
            if (err){
                throw err;
            }else{
            console.log(`Added ${answers.department} to the database.`)
            };
            promptUser();
        });
    })
}

function promptAddRole(){
    // Beginning with the database so that we may acquire the departments for the choice
    db.query(`SELECT * FROM department`, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                // Adding A Role
                type: 'input',
                name: 'role',
                message: 'What is the name of the role?',
                validate: roleInput => {
                    if (roleInput) {
                        return true;
                    } else {
                        console.log('Please Add A Role!');
                        return false;
                    }
                }
            },
            {
                // Adding the Salary
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log('Please Add A Salary!');
                        return false;
                    }
                }
            },
            {
                // Department
                type: 'list',
                name: 'department',
                message: 'Which department does the role belong to?',
                choices: () => {
                    var array = [];
                    for (var i = 0; i < results.length; i++) {
                        array.push(results[i].name);
                    }
                    return array;
                }
            }
        ]).then((answers) => {
            // Comparing the result and storing it into the variable
            for (var i = 0; i < results.length; i++) {
                if (results[i].name === answers.department) {
                    var department = results[i];
                }
            }

            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, results) => {
                if (err) throw err;
                console.log(`Added ${answers.role} to the database.`)
                promptUser();
            });
        })
    });
}

function promptAddEmployee(){
    // Calling the database to acquire the roles and managers
    db.query(`SELECT * FROM employee,role WHERE employee.role_id=role.id;`, (err, result) => {
        if (err) throw err;

        inquirer.prompt([
            {
                // Adding Employee First Name
                type: 'input',
                name: 'firstName',
                message: 'What is the employees first name?',
                validate: firstNameInput => {
                    if (firstNameInput) {
                        return true;
                    } else {
                        console.log('Please Add A First Name!');
                        return false;
                    }
                }
            },
            {
                // Adding Employee Last Name
                type: 'input',
                name: 'lastName',
                message: 'What is the employees last name?',
                validate: lastNameInput => {
                    if (lastNameInput) {
                        return true;
                    } else {
                        console.log('Please Add A Last Name!');
                        return false;
                    }
                }
            },
            {
                // Adding Employee Role
                type: 'list',
                name: 'role',
                message: 'What is the employees role?',
                choices: () => {
                    var array = [];
                    for (var i = 0; i < result.length; i++) {
                        array.push(result[i].title);
                    }
                    var newArray = [...new Set(array)];
                    return newArray;
                }
            },
            {
                // Adding Employee Manager
                type: 'list',
                name: 'manager',
                message: 'Who is your manager?',
                choices: () => {
                    var array = [];
                    for (var i = 0; i < result.length; i++) {
                        array.push(result[i].first_name +' ' + result[i].last_name);
                    }
                    var newArray = [...new Set(array)];
                    console.log(newArray);
                    return newArray;
                }
            }
        ]).then((answers) => {
            // Comparing the result and storing it into the variable
            for (var i = 0; i < result.length; i++) {
                if (result[i].title === answers.role) {
                    var role_id = result[i].role_id;
                }
                // console.log(result[i].first_name)
                // console.log(answers.firstName)
                if (result[i].first_name + ' ' +result[i].last_name === answers.manager) {
                    var manager_id = result[i].id;
                }
            }
            // console.log('Check role below')
            // console.log(role);

            // db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (err, result) => {
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role_id, manager_id], (err, result) => {
                if (err) throw err;
                console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                promptUser();
            });
        })
    });
}


function promptUpdateEmployee(){
    // Calling the database to acquire the roles and managers
    db.query(`SELECT * FROM employee;`, (err, result) => {
        // SELECT * 
        // From table a
        // INNER JOIN table b
        // on role.id = employee.role_id
        // inner join table c
        // on department = role_id
        if (err) throw err;
        const employeeList =  result.map((emp)=> ({
            name: `${emp.first_name} ${emp.last_name}`, 
            value: emp.id
        }))

        db.query('select * from role;', (err, result)=> {
            const roleList =  result.map((role)=> ({
                name: role.title, 
                value: role.id
            }))


            inquirer.prompt([
                {
                    // Choose an Employee to Update
                    type: 'list',
                    name: 'employee',
                    message: 'Which employees role do you want to update?',
                    choices:employeeList
                },
                {
                    // Updating the New Role
                    type: 'list',
                    name: 'title',
                    message: 'What is their new role?',
                    choices: roleList
                }
            ]).then((answers) => {
                
    
                db.query(`UPDATE employee SET role_id ='${answers.title}' WHERE id = ${answers.employee}`, (err, result) => {
                    if (err) throw err;
                    console.log(`Updated ${answers.employee} role to the database.`)
                    promptUser();
                })
            })


        })

    })
}

function promptUser() {
    // Prompt user with question
    inquirer
      .prompt([
        {
          type: "list",
          message:"What would you like to do?",
          choices: ["view all departments", "view all roles", "view all employees","add a department","add a role", "add an employee","update an employee role","exit"],
          name: "choices",
        }
    ]).then((answer) => {
        switch(answer.choices){
            case "exit":
                process.exit();
                break;
            case "view all departments":
                db.query('SELECT * FROM department', function (err, results) {
                    if (err){
                        throw err;
                    }else{
                        console.log("Viewing All Departments: ");
                        console.table(results);
                    }
                    promptUser();
                });
                break;
            case "view all roles":
                db.query(`SELECT role.title, role.id, role.salary, department.name FROM role LEFT JOIN department ON role.department_id = department.id`, (err, results) => {
                    if (err){
                        throw err;
                    }else{
                        console.log("Viewing All Roles: ");
                        console.table(results);
                    }
                    promptUser();
                })
                break;
            case "view all employees":
                db.query(`SELECT * FROM employee`, (err, results) => {
                    if (err){
                        throw err;
                    }else{
                        console.log("Viewing All Employees: ");
                        console.table(results);
                    }
                    promptUser();
                })
                break;
            case "add a department":
                promptAddDepartment();
                // promptUser();
                break;
            case "add a role":
                promptAddRole();
                // promptUser();
                break;
            case "add an employee":
                promptAddEmployee();
                // promptUser();
                break;
            case "update an employee role":
                promptUpdateEmployee();
                // promptUser();
                break;
        };
      });
    }

promptUser();