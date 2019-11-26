Startup guide:
--------------
Use ./Initialization/structure_dummyData.sql to create tables, view and insert dummy data.
Server is configured to listen on 8080 - see ./Controllers/Database/dbController.js for settings


Pages of interest:
------------------
Show all rooms:		http://localhost:8080/rooms

Show all bookings:	http://localhost:8080/bookings
Show bookings made on the 20'th any month/year:		http://localhost:8080/bookings?day=20
Show bookings made on the 10'th month/year:			http://localhost:8080/bookings?day=20
Show bookings made on within a specific timeframe:	http://localhost:8080/bookings?day=20&year=2018&month=11&endDay=21&endMonth=11&endYear=2019

Add a booking (POST):	http://localhost:8080/bookings/add?roomId=1&fromDateTime=2019-11-26 6:00&toDateTime=2019-11-26 8:10