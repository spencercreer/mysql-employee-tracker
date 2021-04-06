INSERT INTO department (name)
VALUES ("SHIELD");
INSERT INTO department (name)
VALUES ("Avengers");
INSERT INTO department (name)
VALUES ("Stark Industries");

INSERT INTO roles (title, salary, department_id)
VALUES ("Director", 1500000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("Stark Industries CEO", 8980000, 2);
INSERT INTO roles (title, salary, department_id)
VALUES ("Special Agent", 875000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("Pilot", 725000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("Secretary", 42000, 3);
INSERT INTO roles (title, salary, department_id)
VALUES ("Chauffeur", 54000, 3);
INSERT INTO roles (title, salary, department_id)
VALUES ("Intern", 17000, 3);
INSERT INTO roles (title, salary, department_id)
VALUES ("King of Asgard", 99900000, 2);
INSERT INTO roles (title, salary, department_id)
VALUES ("Nuclear Physicist", 15200000, 2);
INSERT INTO roles (title, salary, department_id)
VALUES ("Avenger", 1630000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager)
VALUES ("Nick", "Fury", 1, NULL, true);
INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager)
VALUES ("Tony", "Stark", 2, NULL, true);
INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager)
VALUES ("Natasha", "Romanoff", 3, 1, false);
INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager)
VALUES ("Clint", "Barton", 3, 1, false);
INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager)
VALUES ("Pepper", "Potts", 5, 2, false);
INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager)
VALUES ("Harold", "Hogan", 6, 2, false);
INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager)
VALUES ("Peter", "Parker", 7, 2, false);
INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager)
VALUES ("Thor", "Odinson", 8, NULL, false);
INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager)
VALUES ("Bruce", "Banner", 9, NULL, false);
INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager)
VALUES ("Steve", "Rogers", 10, NULL, false);




