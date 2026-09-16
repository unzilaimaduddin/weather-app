const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");
const loading = document.querySelector("#loading");
const errorMsg = document.querySelector("#errorMsg");
const weatherCard = document.querySelector("#weatherCard");

const cityName = document.querySelector("#cityName");
const temp = document.querySelector("#temp");
const description = document.querySelector("#description");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    alert("Please enter a city name!");
    return;
  }
  getWeather(city);
});

// Enter key se bhi search ho jaye
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

async function getWeather(city) {
  // Purani state chupao
  weatherCard.classList.add("hidden");
  errorMsg.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    // Step 1: City ka lat/lon nikalna (Geocoding API)
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found");
    }

    const { latitude, longitude, name } = geoData.results[0];

    // Step 2: Weather data fetch karna
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`,
    );
    const weatherData = await weatherRes.json();

    displayWeather(name, weatherData.current);
  } catch (error) {
    loading.classList.add("hidden");
    errorMsg.classList.remove("hidden");
  }
}

function displayWeather(city, current) {
  loading.classList.add("hidden");
  weatherCard.classList.remove("hidden");

  cityName.textContent = city;
  temp.textContent = `${Math.round(current.temperature_2m)}°C`;
  description.textContent = getWeatherDescription(current.weather_code);
  humidity.textContent = current.relative_humidity_2m;
  wind.textContent = current.wind_speed_10m;
}

// Weather code ko readable text mein convert karna
function getWeatherDescription(code) {
  const weatherCodes = {
    0: "Clear sky ☀️",
    1: "Mainly clear 🌤️",
    2: "Partly cloudy ⛅",
    3: "Overcast ☁️",
    45: "Foggy 🌫️",
    48: "Foggy 🌫️",
    51: "Light drizzle 🌦️",
    61: "Rainy 🌧️",
    63: "Rainy 🌧️",
    65: "Heavy rain 🌧️",
    71: "Snowy ❄️",
    80: "Rain showers 🌦️",
    95: "Thunderstorm ⛈️",
  };
  return weatherCodes[code] || "Weather data unavailable";
}
