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

function promptUpdateEmployee(){
    // Calling the database to acquire the roles and managers
    db.query(`SELECT * FROM employee, role`, (err, result) => {
        if (err) throw err;

        inquirer.prompt([
            {
                // Choose an Employee to Update
                type: 'list',
                name: 'employee',
                message: 'Which employees role do you want to update?',
                choices: () => {
                    var array = [];
                    for (var i = 0; i < result.length; i++) {
                        array.push(result[i].last_name);
                    }
                    var employeeArray = [...new Set(array)];
                    return employeeArray;
                }
            },
            {
                // Updating the New Role
                type: 'list',
                name: 'role',
                message: 'What is their new role?',
                choices: () => {
                    var array = [];
                    for (var i = 0; i < result.length; i++) {
                        array.push(result[i].title);
                    }
                    var newArray = [...new Set(array)];
                    return newArray;
                }
            }
        ]).then((answers) => {
            // Comparing the result and storing it into the variable
            for (var i = 0; i < result.length; i++) {
                if (result[i].last_name === answers.employee) {
                    var name = result[i];
                }
            }

            for (var i = 0; i < result.length; i++) {
                if (result[i].title === answers.role) {
                    var role = result[i];
                }
            }

            db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
                if (err) throw err;
                console.log(`Updated ${answers.employee} role to the database.`)
                // promptUser();
            });
        })
    });
}

module.exports = promptUpdateEmployee