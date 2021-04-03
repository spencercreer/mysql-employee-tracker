INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Spencer", "Creer", 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Smith", 2, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Manager", 100000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Engineer", 65000, 1);

INSERT INTO department (name)
VALUES ("Sales");