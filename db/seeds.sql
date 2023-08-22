-- Inserts names of departments into department table
INSERT INTO department
  (name)
VALUES
  ('Engineering'),
  ('Operation'),
  ('Sales'),
  ('Human Resource'),
  ('Finance'),
  ('Legal');

-- Inserts roles of employee into role table
INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Software Engineer', 85000, 1),
  ('Senior Sales', 75000, 3),
  ('Operation Analyst', 80000, 2),
  ('Accountant', 125000, 5),
  ('Manager', 125000, 1),
  ('Lawyer', 200000, 6);

-- Inserts employee information into employee table
INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Arthur', 'Moore', 5, NULL),
  ('Alice', 'Cheung', 2, 1),
  ('Evelyn', 'Moffett',5,NULL),
  ('Eliana', 'Lin', 4, 3),
  ('Katherine', 'Brann', 1, 1),
  ('Harold', 'Norman', 6, 3);
