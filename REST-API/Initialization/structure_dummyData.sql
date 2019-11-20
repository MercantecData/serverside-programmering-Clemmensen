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




/* Dummy data */
INSERT INTO rooms (RoomName, FloorLocation)
	VALUES ('Windows', 0), ('Beatles', 0);

INSERT INTO room_bookings (RoomId, StartTime, EndTime)
	VALUES	(1, '2019-11-20-12:00', '2019-11-20-13:00'),
			(1, '2019-11-20-13:00', '2019-11-20-15:00'),
			(1, '2019-11-20-8:00', '2019-11-20-10:00'),
			(2, '2019-11-20-11:00', '2019-11-20-13:00'),
			(2, '2019-11-20-7:00', '2019-11-20-8:00');



/*

2. N�r man g�r ind p� /bookings skal man modtage en oversigt over alle bookinger der er aktive idag. Man skal kunne �ndre GET parametrene s�ledes at man kan f� for en anden dag. (f.eks. hvis man g�r ind p� "/bookings?day=14" s� f�r man bookingen for d. 14. i m�neden)

3. Hvis man sender en POST request til /add kan man tilf�je en ny booking til systemet. Hvis det ikke er en POST request skal der ikke ske noget.

4. Lav et id-system for API'en. Den der vil tilg� den skal have en key, som skal sendes med som parameter n�r man tilg�r API'en*/