"use strict";

const API_KEY = "9b387b0d2dcd1f393fb5e402547b35a7";
const API_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&";
const DEFAULT_LOCATION = "los angeles";

const cityNameEl = document.querySelector(".search input");
const buttonEl = document.querySelector(".search button");
const containerEl = document.querySelector(".container");
const loader = document.querySelector(".loader");


buttonEl.addEventListener("click", () => {
  processData(cityNameEl.value);
});
cityNameEl.addEventListener("keypress", (e) => {
  const keyCode = e.key;
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

async function findUserLocation() {
//   try{
//     const res =  await new  Promise( (resolve, reject) => {
//     loader.classList.remove("hidden");
//      navigator.geolocation.getCurrentPosition(
//       (position) => resolve(position),
//       (error) => reject(error)
//     );
//   })
  
//   const { coords } =  res;
//   const data = [coords.latitude, coords.longitude];
//   loader.classList.add("hidden");
//    processData("", ...data);
// }catch (err){ 
//   processData(DEFAULT_LOCATION)
// }
    
  let getLocationPromise = () => {
    return new Promise( (resolve, reject) => {
      loader.classList.remove("hidden");
      // Promisifying the geolocation API
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error)
      );
    });
  };
  

  try {
    
    const res = await getLocationPromise();
    const { coords } =  res;
    const data = [coords.latitude, coords.longitude];
    loader.classList.add("hidden");
    // If the first argument is null it will fetch the data by coords
    processData("", ...data);
    
  } catch (error) {
    // If promise get rejected
     processData(DEFAULT_LOCATION);
  }
}

async function processData(name, lat, lon) {
  containerEl.classList.add("hidden");
  loader.classList.remove("hidden");

  let url = "";
  if (name === "" ) {
    url = buildRequestUrlByCoords(lat, lon);
  } else url = buildRequestUrlByName(name);
  await requestData(url);
}
function buildRequestUrlByCoords(lat, lon) {
  //api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API key}
  return `${API_URL}lat=${lat}&lon=${lon}&appid=${API_KEY}`;
}
function buildRequestUrlByName(cityName) {
  return `${API_URL}q=${cityName}&appid=${API_KEY}`;
}
async function requestData(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    const newData = createFormatedData(data);
    renderCard(newData);
  } catch (err) {
    renderError();
  }
}
function renderError() {
  loader.classList.add("hidden");
  containerEl.classList.add("hidden");
  const errorEl = document.querySelector(".error");
  errorEl.classList.remove("hidden");
  
}
function createFormatedData(data) {
  const weatherMap = [
    "clear",
    "clouds",
    "drizzle",
    "mist",
    "rain",
    "snow",
    "haze",
    "smoke",
    "windy",
    "thunderstorm",
    "dust",
    "fog",
    "sand",
    "ash",
    "squall",
    "tornado",
  ];
  const weatherCondition = data.weather[0].main.toLowerCase();
  let weatherImg = "./assets/clear.png";
  weatherMap.forEach((item) => {
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
    weatherIcon: weatherImg,
  };
}

function renderCard({ temp, city, country, humidity, windspeed, weatherIcon }) {
    
  const errorEl = document.querySelector(".error");
  const tempEl = document.querySelector(".temp");
  const cityEl = document.querySelector(".city");
  const humidityEl = document.querySelector("#humidity");
  const windspeedEl = document.querySelector("#windspeed");
  const imgEl = document.querySelector(".weather-icon");
  cityNameEl.value = city;
  errorEl.classList.add("hidden");
  loader.classList.add("hidden");
  containerEl.classList.remove("hidden");
  tempEl.textContent = temp + "°C";
  cityEl.textContent = city + ", " + country;
  humidityEl.textContent = `${humidity}% Humidity`;
  const str = windspeed + "<i>km/hr </i><span class='nowrap'>Wind Speed</span>";
  windspeedEl.innerHTML = decode(str);
  imgEl.src = weatherIcon;
}

function decode(str) {
  const textareaEl = document.createElement("textarea");
  textareaEl.innerHTML = str;
  return textareaEl.value;
}
