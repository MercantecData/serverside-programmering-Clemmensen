DROP DATABASE IF EXISTS h3_macl_rest_api;
CREATE DATABASE h3_macl_rest_api;
USE h3_macl_rest_api;

CREATE TABLE rooms (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(40) NOT NULL,
	floor_location INT NOT NULL
);



/*Du skal programmere en REsT API som fungerer som et lokale booking system. Dataen skal sendes til klienten i .json format.

1. Når man går ind på /rooms skal man modtage en oversigt over lokaler i systemet.

2. Når man går ind på /bookings skal man modtage en oversigt over alle bookinger der er aktive idag. Man skal kunne ændre GET parametrene således at man kan få for en anden dag. (f.eks. hvis man går ind på "/bookings?day=14" så får man bookingen for d. 14. i måneden)

3. Hvis man sender en POST request til /add kan man tilføje en ny booking til systemet. Hvis det ikke er en POST request skal der ikke ske noget.

4. Lav et id-system for API'en. Den der vil tilgå den skal have en key, som skal sendes med som parameter når man tilgår API'en*/