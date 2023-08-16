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
            // promptUser();
        });
    })
}

module.exports = promptAddDepartment