/* Structure */
DROP DATABASE IF EXISTS h3_macl_rest_api;
CREATE DATABASE h3_macl_rest_api;
USE h3_macl_rest_api;

CREATE TABLE rooms (
	Id INT PRIMARY KEY AUTO_INCREMENT,
	RoomName VARCHAR(40) NOT NULL,
	FloorLocation INT NOT NULL
);

CREATE TABLE room_bookings (
	Id INT PRIMARY KEY AUTO_INCREMENT,
	RoomId INT NOT NULL,
	StartTime DATETIME NOT NULL,
	EndTime DATETIME NOT NULL,
    CONSTRAINT FK_roombooking_rooms
    	FOREIGN KEY (RoomId) REFERENCES rooms(Id)
    	ON DELETE RESTRICT
    	ON UPDATE CASCADE
);


/* Stored procedures */
DROP PROCEDURE IF EXISTS GetBookings;
DELIMITER //
CREATE PROCEDURE GetBookings(IN startDay INT, startMonth INT, startYear INT, endDay INT, endMonth INT, endYear INT)
BEGIN

	IF startDay > 0 AND startMonth > 0 AND startYear > 0 THEN
		SELECT room_bookings.*, rooms.RoomName, rooms.FloorLocation FROM room_bookings
			INNER JOIN rooms on room_bookings.RoomId = rooms.Id
			WHERE ((StartTime >= STR_TO_DATE(concat(startYear,startMonth,startDay),'%Y%m%d %h%i'))
				AND (EndTime <= STR_TO_DATE(concat(endYear,endMonth,endDay),'%Y%m%d %h%i'))) ORDER BY StartTime, room_bookings.RoomId;
	ELSEIF startYear > 0 THEN
		SELECT room_bookings.*, rooms.RoomName, rooms.FloorLocation FROM room_bookings
			INNER JOIN rooms on room_bookings.RoomId = rooms.Id
			WHERE ((YEAR(StartTime) >= startYear)
				AND (YEAR(endTime) <= endYear)) ORDER BY StartTime, room_bookings.RoomId;
	ELSE
		SELECT room_bookings.*, rooms.RoomName, rooms.FloorLocation FROM room_bookings
			INNER JOIN rooms on room_bookings.RoomId = rooms.Id
			WHERE (startDay = 0 OR (DAY(StartTime) >= startDay)	AND (DAY(EndTime) <= endDay))
				AND	(startMonth = 0 OR (MONTH(StartTime) >= startMonth) AND (MONTH(EndTime) <= endMonth)) ORDER BY StartTime, room_bookings.RoomId;
	END IF;		

END //
DELIMITER ;


/* Dummy data */
INSERT INTO rooms (RoomName, FloorLocation)
	VALUES ('Windows', 0), ('Beatles', 0), ('Linus Torvalds [A1.41]', 1), ('A1.40', 1), ('A1.39 (Glas)', 1), ('A1.38 (firkantet)', 1);

INSERT INTO room_bookings (RoomId, StartTime, EndTime)
	VALUES	(1, '2018-11-20-12:00', '2018-11-20-13:00'),
			(1, '2019-10-20-13:00', '2019-10-20-15:00'),
			(1, '2019-11-20-8:00', '2019-11-20-10:00'),
			(2, '2019-11-20-11:00', '2019-11-20-13:00'),
			(2, '2019-11-20-7:00', '2019-11-20-8:00'),
			(1, '2019-11-22-13:00', '2019-11-22-15:00'),
			(1, '2019-11-21-8:00', '2019-11-21-10:00'),
			(2, '2019-11-23-11:00', '2019-11-23-13:00'),
			(2, '2019-11-23-7:00', '2019-11-23-8:00');



/*
3. Hvis man sender en POST request til /add kan man tilføje en ny booking til systemet. Hvis det ikke er en POST request skal der ikke ske noget.

4. Lav et id-system for API'en. Den der vil tilgå den skal have en key, som skal sendes med som parameter når man tilgår API'en*/