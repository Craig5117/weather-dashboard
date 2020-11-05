var getWeatherData = function(city) {fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=af9ded99d1790eca45328d602b9e06d9").then(function(response) {
        
        if (response.ok) {
            response.json().then(function(data) {
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                console.log(data);
                // console.log("Location: " + data.name, 
                // "Temperature: " + Math.round(data.main.temp) + " °F",
                // "Humidity: " + data.main.humidity +"%",
                // "Wind Speed: " + data.wind.speed + " MPH",
                // "Coordinates: " + data.coord.lat + ", " + data.coord.lon);
                var location = data.name;
                var currentDate = moment().format('MM/DD/YYYY');
                console.log(data.weather[0].main);
                var weather = "";
                switch (data.weather[0].main) {
                    case "Thunderstorm":
                        weather = " <img src='./assets/images/lightning.svg' />";
                        break;
                    case "Drizzle": 
                        weather = " <img src='./assets/images/drizzle.svg' />";
                        break;
                    case "Rain":
                        weather = " <img src='./assets/images/rain.svg' />";
                        break;
                    case "Snow":
                        weather = " <img src='./assets/images/snow.svg' />";
                        break;
                    case "Clear":
                        weather = " <img src='./assets/images/sun3.svg' />";
                        break;
                    case "Clouds":
                        weather = " <img src='./assets/images/cloud.svg' />";
                        break;
                    case "Tornado":
                        weather = " <img src='./assets/images/tornado.svg' />";
                        break;
                    default:
                        weather = " <img src='./assets/images/fog.svg' />";
                        break;

                }
                $("#location").html(location + " (" + currentDate + ")" + weather);
                $("#temperature").text("Temperature: " + data.main.temp.toFixed(1) + " °F");
                $("#humidity").text("Humidity: " + data.main.humidity +"%");
                $("#windspeed").text("Wind Speed: " + data.wind.speed + " MPH");
                fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=af9ded99d1790eca45328d602b9e06d9").then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            $("#uv").html("UV Index: <span class='bg-danger text-light py-1 px-2 rounded'>" + data.value.toFixed(1) + "</span>");
                        })
                    }
                })
            });
            
        }
    })
}


getWeatherData("Vancouver")