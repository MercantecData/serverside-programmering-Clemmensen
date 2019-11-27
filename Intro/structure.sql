DROP DATABASE IF EXISTS h3_serverside_programming;
CREATE DATABASE h3_serverside_programming;

CREATE TABLE names (
	id INT  PRIMARY KEY AUTO_INCREMENT,
	name TEXT
);

INSERT INTO names (name) VALUES ('Peter'), ('Paul'), ('Poul'), ('Petra'), ('Patricia'), ('Petunia');