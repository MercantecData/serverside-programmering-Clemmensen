Startup guide:
--------------
Use ./Initialization/structure_dummyData.sql to create tables, view and insert dummy data.
Server is configured to listen on 8080 - see ./Controllers/Database/dbController.js for settings

Usage:
------
Configure the browser or client application (suggestion: Postman) to send a api-key header from structure_dummyData.sql

Example of header: "api-key", "dc77e33ede3e87c178a0a985a5e1b8a1"
- Make a get or post request to one of the below api end points.


Pages of interest:
------------------
GET, Show all rooms:		http://localhost:8080/rooms

GET, Show all bookings:	http://localhost:8080/bookings
GET, how bookings made on the 20'th any month/year:		http://localhost:8080/bookings?day=20
GET, Show bookings made on the 10'th month of any year:	http://localhost:8080/bookings?month=10
GET, Show bookings made on within a specific timeframe:	http://localhost:8080/bookings?day=20&month=11&year=2018&endDay=21&endMonth=11&endYear=2019

POST, Add a booking:	http://localhost:8080/bookings/add
- add the following to post body: {"roomId":5,"fromDateTime":"2019-12-26T11:20:00.000Z","toDateTime":"2019-12-26T17:50:00.000Z"}


Alternative add booking functionality (though I would suggest sending the data in body):
1. Go to ".\Controllers\Pages\bookingsController.js", line 38 and change useBodyForPostRequest to false.
2. Run the server from new, and then make a post command to the below url (GET will not work), body can now be left empty
http://localhost:8080/bookings/add?roomId=1&fromDateTime=2019-12-26T11:20:00.000Z&toDateTime=2019-12-26T17:50:00.000Z