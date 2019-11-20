DROP DATABASE IF EXISTS h3_macl_rest_api;
CREATE DATABASE h3_macl_rest_api;
USE h3_macl_rest_api;

CREATE TABLE rooms (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(40) NOT NULL,
	floor_location INT NOT NULL
);



/*Du skal programmere en REsT API som fungerer som et lokale booking system. Dataen skal sendes til klienten i .json format.

1. N�r man g�r ind p� /rooms skal man modtage en oversigt over lokaler i systemet.

2. N�r man g�r ind p� /bookings skal man modtage en oversigt over alle bookinger der er aktive idag. Man skal kunne �ndre GET parametrene s�ledes at man kan f� for en anden dag. (f.eks. hvis man g�r ind p� "/bookings?day=14" s� f�r man bookingen for d. 14. i m�neden)

3. Hvis man sender en POST request til /add kan man tilf�je en ny booking til systemet. Hvis det ikke er en POST request skal der ikke ske noget.

4. Lav et id-system for API'en. Den der vil tilg� den skal have en key, som skal sendes med som parameter n�r man tilg�r API'en*/