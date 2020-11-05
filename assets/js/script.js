var getWeatherData = function(city) {fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=af9ded99d1790eca45328d602b9e06d9").then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                console.log("Location: " + data.name, "Temperature: " + Math.round(data.main.temp) + " °F", "Humidity: " + data.main.humidity +"%", "Wind Speed: " + data.wind.speed + " MPH", "Coordinates: " + data.coord.lat + ", " + data.coord.lon);
            });
        }
    })
}


getWeatherData("Johnson City")