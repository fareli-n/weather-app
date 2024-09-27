"use strict";

var API_KEY = "9b387b0d2dcd1f393fb5e402547b35a7";
var API_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&";
var DEFAULT_LOCATION = "los angeles";
var cityNameEl = document.querySelector(".search input");
var buttonEl = document.querySelector(".search button");
var containerEl = document.querySelector(".container");
var loader = document.querySelector(".loader");
buttonEl.addEventListener("click", function () {
  processData(cityNameEl.value);
});
cityNameEl.addEventListener("keypress", function (e) {
  var keyCode = e.key;

  if (keyCode === "Enter") {
    processData(cityNameEl.value);
  }
});
init();

function init() {
  if (navigator.geolocation) {
    findUserLocation();
  } else processData(DEFAULT_LOCATION);
}

function findUserLocation() {
  var getLocationPromise, res, coords, data;
  return regeneratorRuntime.async(function findUserLocation$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          getLocationPromise = function getLocationPromise() {
            return new Promise(function (resolve, reject) {
              // Promisifying the geolocation API
              navigator.geolocation.getCurrentPosition(function (position) {
                return resolve(position);
              }, function (error) {
                return reject(error);
              });
            });
          }; //   getLocationPromise()
          //     .then(res => {
          //       // If promise get resolved
          //       const { coords } = res;
          //       return [coords.latitude, coords.longitude];
          //     })
          //     .then (data=>{
          //        processData("",...data )
          //     })
          //     .catch((error) => {
          //       // If promise get rejected
          //       console.log("Data not found");
          //     });


          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(getLocationPromise());

        case 4:
          res = _context.sent;
          coords = res.coords;
          data = [coords.latitude, coords.longitude]; // If the first argument is null it will fetch the data by coords

          processData.apply(void 0, [""].concat(data));
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          // If promise get rejected
          processData(DEFAULT_LOCATION);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 10]]);
}

function processData(name, lat, lon) {
  var url;
  return regeneratorRuntime.async(function processData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          containerEl.classList.add("hidden");
          loader.classList.remove("hidden");
          url = "";

          if (name === "") {
            url = buildRequestUrlByCoords(lat, lon);
          } else url = buildRequestUrlByName(name);

          _context2.next = 6;
          return regeneratorRuntime.awrap(requestData(url));

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function buildRequestUrlByCoords(lat, lon) {
  //api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API key}
  return "".concat(API_URL, "lat=").concat(lat, "&lon=").concat(lon, "&appid=").concat(API_KEY);
}

function buildRequestUrlByName(cityName) {
  return "".concat(API_URL, "q=").concat(cityName, "&appid=").concat(API_KEY);
}

function requestData(url) {
  var res, data, newData;
  return regeneratorRuntime.async(function requestData$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(fetch(url));

        case 3:
          res = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(res.json());

        case 6:
          data = _context3.sent;
          newData = createFormatedData(data);
          renderCard(newData);
          _context3.next = 14;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          renderError();

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
}

function renderError() {
  loader.classList.add("hidden");
  containerEl.classList.add("hidden");
  var errorEl = document.querySelector(".error");
  errorEl.classList.remove("hidden");
}

function createFormatedData(data) {
  var weatherMap = ["clear", "clouds", "drizzle", "mist", "rain", "snow", "haze", "smoke", "windy", "thunderstorm", "dust", "fog", "sand", "ash", "squall", "tornado"];
  var weatherCondition = data.weather[0].main.toLowerCase();
  var weatherImg = "./assets/clear.png";
  weatherMap.forEach(function (item) {
    if (item === weatherCondition) {
      weatherImg = "./assets/" + item + ".png";
      return;
    }
  });
  return {
    temp: Math.round(data.main.temp),
    city: data.name,
    country: data.sys.country,
    humidity: data.main.humidity,
    windspeed: data.wind.speed,
    weatherIcon: weatherImg //   };

  };
}

function renderCard(_ref) {
  var temp = _ref.temp,
      city = _ref.city,
      country = _ref.country,
      humidity = _ref.humidity,
      windspeed = _ref.windspeed,
      weatherIcon = _ref.weatherIcon;
  var errorEl = document.querySelector(".error");
  var tempEl = document.querySelector(".temp");
  var cityEl = document.querySelector(".city");
  var humidityEl = document.querySelector("#humidity");
  var windspeedEl = document.querySelector("#windspeed");
  var imgEl = document.querySelector(".weather-icon");
  cityNameEl.value = city;
  errorEl.classList.add("hidden");
  loader.classList.add("hidden");
  containerEl.classList.remove("hidden");
  tempEl.textContent = temp + "°C";
  cityEl.textContent = city + ", " + country;
  humidityEl.textContent = "".concat(humidity, "% Humidity");
  var str = windspeed + "<i>km/hr </i><span class='nowrap'>Wind Speed</span>";
  windspeedEl.innerHTML = decode(str);
  imgEl.src = weatherIcon;
}

function decode(str) {
  var textareaEl = document.createElement("textarea");
  textareaEl.innerHTML = str;
  return textareaEl.value;
}