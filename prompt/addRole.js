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
                // promptUser();
            });
        })
    });
}

module.exports = promptAddRole