async function getWeather() {

    const city = document.getElementById("city").value.trim();

    if (!city) {
        alert("Please enter a city.");
        return;
    }

    try {

        // Get latitude & longitude
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results) {
            alert("City not found!");
            return;
        }

        const location = geoData.results[0];
        const latitude = location.latitude;
        const longitude = location.longitude;

        // Get weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code`
        );

        const weatherData = await weatherResponse.json();

        document.getElementById("weather").style.display = "block";

        document.getElementById("cityName").textContent =
            `${location.name}, ${location.country}`;

        document.getElementById("temp").textContent =
            `${weatherData.current.temperature_2m} °C`;

        document.getElementById("wind").textContent =
            `Wind Speed: ${weatherData.current.wind_speed_10m} km/h`;

        document.getElementById("condition").textContent =
            "Weather: " + getWeatherDescription(weatherData.current.weather_code);

    } catch (error) {
        console.log(error);
        alert("Something went wrong.");
    }
}

function getWeatherDescription(code) {

    const weatherCodes = {
        0: "Clear Sky ☀️",
        1: "Mainly Clear 🌤",
        2: "Partly Cloudy ⛅",
        3: "Overcast ☁️",
        45: "Fog 🌫",
        48: "Depositing Rime Fog 🌫",
        51: "Light Drizzle 🌦",
        53: "Moderate Drizzle 🌦",
        55: "Dense Drizzle 🌧",
        61: "Light Rain 🌧",
        63: "Moderate Rain 🌧",
        65: "Heavy Rain 🌧",
        71: "Light Snow ❄️",
        73: "Moderate Snow ❄️",
        75: "Heavy Snow ❄️",
        80: "Rain Showers 🌦",
        81: "Moderate Showers 🌧",
        82: "Violent Showers ⛈",
        95: "Thunderstorm ⛈"
    };

    return weatherCodes[code] || "Unknown";
}