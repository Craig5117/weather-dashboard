// var searchContainerEl = document.querySelector("#search-container");
var cityHistory = [];
var appId = "af9ded99d1790eca45328d602b9e06d9";

var units = "imperial";
var tempUnitDisplay = "°F";
var speedUnitDisplay = "MPH";
var dateFormat = "MM/DD/YYYY";
var fiveDateFormat = "MM/DD YYYY";

var loadHistory = function() {
    cityHistory = localStorage.getItem("cityHistory");
    cityHistory = JSON.parse(cityHistory);
    if (cityHistory.length === 0) {
        cityHistory = [];
        return;
    } 
    else { 
        for (var i = 0; i < cityHistory.length; ++i) {
            var historyEl = document.createElement("p");
            historyEl.textContent = cityHistory[i];
            historyEl.classList = "search-history list-group-item btn btn-light border border-black-50 col-6 col-md-12 mb-1 overflow-hidden";
            $("#search-container").append(historyEl);
        }
    }    

};

var conditionSet = function(dataSet) {
    switch (dataSet) {
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
            weather = " <img src='./assets/images/fog2.svg' />";
            break;
    }
};
    
var getWeatherData = function(city) {fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&appid=" + appId).then(function(response) {
        
        if (response.ok) {
            response.json().then(function(data) {
                conditionSet(data.weather[0].main);
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                var location = data.name;
                var currentDate = moment().format(dateFormat);
                $("#location").html(location + " (" + currentDate + ")" + weather);
                $("#temperature").text("Temperature: " + data.main.temp.toFixed(1) + " " + tempUnitDisplay);
                $("#humidity").text("Humidity: " + data.main.humidity +"%");
                $("#windspeed").text("Wind Speed: " + data.wind.speed + " " + speedUnitDisplay);
                getFiveDay(lat, lon);
                updateHistory(location);
                fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + appId).then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            
                            
                             
                            $("#uv").html("UV Index: <span class='text-light py-1 px-2 rounded' id='uv-val'>" + data.value.toFixed(1) + "</span>");
                            $("#uv-val").removeClass("bg-warning", "bg-danger", "bg-success");
                            if (data.value > 2 && data.value < 5) {
                                $("#uv-val").addClass("bg-warning");       
                            }
                            else if (data.value < 2) {
                                $("#uv-val").addClass("bg-success");
                            }    
                            else if (data.value > 5) {
                                $("#uv-val").addClass("bg-danger");
                            }
                            console.log($("#uv"));
                        });
                    }
                    else {
                        alert("Unable to display UV Index. Please try again.");
                    }
                });
            });
            
        }
        else {
            alert("Unable to display information for that city. Make sure it is spelled correctly.");
        }
    });
};

var getFiveDay = function(lat, lon) {fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=" + units + "&appid=" + appId).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // console.log(data);
                var fiveDay = data.daily;
                fiveDay.splice(6);
                fiveDay.shift();
                var i = 0;
                var x = 1;
                $(".5day").each(function(){                   
                    // console.log(fiveDay[i])
                    $(this).children(".5day-temp").text("Temp: " + Math.round(fiveDay[i].temp.day) + tempUnitDisplay);
                    $(this).children(".5day-hum").text("Hum: " + fiveDay[i].humidity + "%");
                    conditionSet(fiveDay[i].weather[0].main);
                    $(this).children(".5day-condition").html(weather);
                    var forecastDate = moment().add(x, 'days').format(fiveDateFormat);
                    $(this).children(".5day-date").text(forecastDate);
                    ++x;
                    ++i;
                });
            });
        }
        else {
            alert("Unable to display five day forecast. Please try again");
        }
    });
};
var getPrevious = function(){
    var historySearch = $(this).text().trim();
    getWeatherData(historySearch);
};

var citySubmitHandler = function(event) {
    event.preventDefault();
    var city = $("#searchBar").val().trim();
    
    if (city) {
        getWeatherData(city);
        $("#searchBar").val("");
    }
    else {
        alert("Please enter a city.");
    }
};

var updateHistory = function(location){
    if (cityHistory.includes(location)){
        return;
    }
    else {
        cityHistory.push(location);
        
        if (cityHistory.length > 8) {
            cityHistory.shift();
        }
        localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
        $(".search-history").each(function(){
            $(this).remove();
        });
        loadHistory();
            
    }
};

// var loadHistory = function() {

    // if (cityHistory.length === 0) {
    //     return cityHistory = []
    // }
    // else {
        // updateHistory();
    // }
// }

loadHistory();
$("#°C").on("click", function() {
    units = "metric";
    tempUnitDisplay = "°C";
    speedUnitDisplay = "KMH";
    dateFormat = "DD/MM/YYYY";
    fiveDateFormat = "DD/MM YYYY";
});
$("#°F").on("click", function() {
    units = "imperial";
    tempUnitDisplay = "°F";
    speedUnitDisplay = "MPH";
    dateFormat = "MM/DD/YYYY";
    fiveDateFormat = "MM/DD YYYY";
});
$("#search-container").on("submit", citySubmitHandler);
$("#search-container").on("click", ".search-history", getPrevious);

