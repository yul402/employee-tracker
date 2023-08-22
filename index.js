const inquirer = require("inquirer");
const mysql = require('mysql2');
require('console.table')

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

// Prompt to add department
  function promptAddDepartment(){
    inquirer.prompt([
        // Collect department information
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

// Prompt to add a role
function promptAddRole(){
    // Get department information
    db.query(`SELECT * FROM department`, (err, results) => {

        if (err) throw err;

        const depList = results.map((dep)=>({
            name: `${dep.name}`, 
            value: dep.id
        }))

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
                // Add department information
                type: 'list',
                name: 'department',
                message: 'Which department does the role belong to?',
                choices: depList
            }
        ]).then((answers) => {
            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, answers.department], (err, results) => {
                if (err) throw err;
                console.log(`Added ${answers.role} to the database.`)
                promptUser();
            });
        })
    });
}

// Prompt to add employee
function promptAddEmployee(){
    // Calling the database to acquire the roles and managers
    db.query(`SELECT * FROM employee LEFT JOIN role ON employee.role_id=role.id;`, (err, result) => {
        if (err) throw err;

        const employeeList =  result.map((emp)=> ({
            name: `${emp.first_name} ${emp.last_name}`, 
            value: emp.id
        }))
        console.log(employeeList)

        db.query('SELECT * FROM role;',(err,result) => {
            if (err) throw err;
            const roleList =  result.map((role)=> ({
                name: `${role.title}`, 
                value: role.id
            }))


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
                    choices: roleList
                },
                {
                    // Adding Employee Manager
                    type: 'list',
                    name: 'manager',
                    message: 'Who is your manager?',
                    choices: employeeList
                }
            ]).then((answers) => {
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, answers.role, answers.manager], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                    promptUser();
                });
            })
        });
    })
}



// Prompt to update employee
function promptUpdateEmployee(){
    // Calling the database to acquire the roles and managers
    db.query(`SELECT * FROM employee;`, (err, result) => {

        if (err) throw err;
        const employeeList =  result.map((emp)=> ({
            name: `${emp.first_name} ${emp.last_name}`, 
            value: emp.id
        }))

        // Calling to get role information
        db.query('SELECT * FROM role;', (err, result)=> {
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
                    choices: employeeList
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
                db.query('SELECT id as departmentId, name as departmentName FROM department', function (err, results) {
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
                db.query(`
                    SELECT role.title as jobTitle, role.id as roleId, role.salary as salary, department.name as departmentName 
                    FROM role 
                    LEFT JOIN department 
                    ON role.department_id = department.id;
                    `, (err, results) => {
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
                db.query(`
                SELECT employee.id, employee.first_name, employee.last_name, concat(manager.first_name, ' ', manager.last_name) as Managername, role.title as job_title,salary, department.name as department_name 
                FROM employee 
                LEFT JOIN role on employee.role_id = role.id 
                LEFT JOIN department on role.department_id=department.id
                LEFT JOIN employee AS manager ON manager.id = employee.manager_id;
                `, (err, results) => {
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
                break;
            case "add a role":
                promptAddRole();
                break;
            case "add an employee":
                promptAddEmployee();
                break;
            case "update an employee role":
                promptUpdateEmployee();
                break;
        };
      });
    }

promptUser();