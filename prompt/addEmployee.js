const inquirer = require("inquirer");
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'MLy6419649211_',
      database: 'employee_tracker_db'
    },
    console.log(`Connected to the employee_tracker_db database.`)
  );

function promptAddEmployee(){
    // Calling the database to acquire the roles and managers
    db.query(`SELECT * FROM employee, role`, (err, result) => {
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
                        console.log('Please Add A Salary!');
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
                type: 'input',
                name: 'manager',
                message: 'Who is your manager?',
                validate: managerInput => {
                    if (managerInput) {
                        return true;
                    } else {
                        console.log('Please Add A Manager!');
                        return false;
                    }
                }
            }
        ]).then((answers) => {
            // Comparing the result and storing it into the variable
            for (var i = 0; i < result.length; i++) {
                if (result[i].title === answers.role) {
                    var role = result[i];
                }
            }

            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (err, result) => {
                if (err) throw err;
                console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                // promptUser();
            });
        })
    });
}

module.exports = promptAddEmployee