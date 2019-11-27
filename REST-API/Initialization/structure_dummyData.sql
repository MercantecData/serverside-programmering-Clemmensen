/* Structure */
DROP DATABASE IF EXISTS h3_macl_rest_api;
CREATE DATABASE h3_macl_rest_api;
USE h3_macl_rest_api;

CREATE TABLE rooms (
	id INT PRIMARY KEY AUTO_INCREMENT,
	room_name VARCHAR(40) NOT NULL,
	floor_location INT NOT NULL
);

CREATE TABLE room_bookings (
	id INT PRIMARY KEY AUTO_INCREMENT,
	room_id INT NOT NULL,
	start_time DATETIME NOT NULL,
	end_time DATETIME NOT NULL,
    CONSTRAINT FK_roombooking_rooms
    	FOREIGN KEY (room_id) REFERENCES rooms(id)
    	ON DELETE RESTRICT
    	ON UPDATE CASCADE
);

CREATE TABLE api_keys (
	id INT PRIMARY KEY AUTO_INCREMENT,
	keyphrase VARCHAR(32) NOT NULL,
	company VARCHAR(100),
	contact_person VARCHAR(100) NOT NULL,
	contact_email VARCHAR(100) NOT NULL,
	valid_from DATETIME NOT NULL,
	valid_to DATETIME NOT NULL
);


/* Stored procedures */
DROP PROCEDURE IF EXISTS GetBookings;
DELIMITER //
CREATE PROCEDURE GetBookings(IN startDay INT, startMonth INT, startYear INT, endDay INT, endMonth INT, endYear INT)
BEGIN

	IF startDay > 0 AND startMonth > 0 AND startYear > 0 THEN
		SELECT room_bookings.*, rooms.room_name, rooms.floor_location FROM room_bookings
			INNER JOIN rooms on room_bookings.room_id = rooms.id
			WHERE ((start_time >= STR_TO_DATE(concat(startYear,startMonth,startDay),'%Y%m%d %h%i'))
				AND (end_time <= STR_TO_DATE(concat(endYear,endMonth,endDay),'%Y%m%d %h%i'))) ORDER BY start_time, room_bookings.room_id;
	ELSE
		SELECT room_bookings.*, rooms.room_name, rooms.floor_location FROM room_bookings
		INNER JOIN rooms on room_bookings.room_id = rooms.id
		WHERE (
			(startDay = 0 OR DAY(start_time) = startDay
				OR ((DAY(start_time) >= startDay) AND (DAY(end_time) <= endDay) AND startDay != endDay))
			AND (startMonth = 0 OR MONTH(start_time) = startMonth
				OR ((MONTH(start_time) >= startMonth) AND (MONTH(end_time) <= endMonth) AND startMonth != endMonth))
			AND (startYear = 0 OR YEAR(start_time) = startYear
				OR ((YEAR(start_time) >= startYear) AND (YEAR(end_time) <= endYear) AND startYear != endYear))
		) ORDER BY start_time, room_bookings.room_id;
	END IF;		

END //
DELIMITER ;


/* Dummy data */
INSERT INTO rooms (room_name, floor_location)
	VALUES ('Windows', 0), ('Beatles', 0), ('Linus Torvalds [A1.41]', 1), ('A1.40', 1), ('A1.39 (Glas)', 1), ('A1.38 (firkantet)', 1);

INSERT INTO room_bookings (room_id, start_time, end_time)
	VALUES	(1, '2018-11-20-12:00', '2018-11-20-13:00'),
			(1, '2019-10-20-13:00', '2019-10-20-15:00'),
			(1, '2019-11-20-8:00', '2019-11-20-10:00'),
			(2, '2019-11-20-11:00', '2019-11-20-13:00'),
			(2, '2019-11-20-7:00', '2019-11-20-8:00'),
			(1, '2019-11-22-13:00', '2019-11-22-15:00'),
			(1, '2019-11-21-8:00', '2019-11-21-10:00'),
			(2, '2019-11-23-11:00', '2019-11-23-13:00'),
			(2, '2019-11-23-7:00', '2019-11-23-8:00'),
			(2, '2018-1-3-7:00', '2019-10-5-8:00');


INSERT INTO api_keys (keyphrase, company, contact_person, contact_email, valid_from, valid_to)
	VALUES	('0eab900561d45971a79567c251ba7c4b', 'Avengers', 'Tony Stark', 'tony3000@stark-industries.com', '2018-11-26-7:00', '2019-5-25-7:00'),
			('dc77e33ede3e87c178a0a985a5e1b8a1', 'Guardians of the galaxy', 'Peter Quill', 'peter.quill@starlords.com', '2018-11-26-8:00', '2020-5-25-7:00'),
			('ac4d082784d62d262738e94e011e8b53', 'Doctor Strange', 'Dr. Strange', 'strange@iam_a_doctor.com', '1900-1-1-1:00', '4900-1-1-1:00');
