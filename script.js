async function fetchWeather() {
  let searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";
  const apiKey = "apikey"; // put your OpenWeather API key here

  // 1. Check for empty input
  if (searchInput.trim() === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input</h2>
        <p>Please enter a valid city name.</p>
      </div>
    `;
    return;
  }

  // 2. Get lat/lon from city name
  async function getLonAndLat() {
    const countryCode = 91; // optional, restrict to India
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)},${countryCode}&limit=1&appid=${apiKey}`;

    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.log("Bad response!", response.status);
      return null;
    }

    const data = await response.json();
    if (data.length === 0) {
      weatherDataSection.innerHTML = `
        <div>
          <h2>Invalid City</h2>
          <p>Please enter a valid <u>city name</u>.</p>
        </div>
      `;
      return null;
    }
    return data[0]; // object with lat & lon
  }

  // 3. Get weather data from lat/lon
  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await fetch(weatherURL);

    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();
    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" 
           alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>
    `;
  }

  // 4. Call functions
  document.getElementById("search").value = "";
  const geocodeData = await getLonAndLat();
  if (geocodeData) {
    getWeatherData(geocodeData.lon, geocodeData.lat);
  }
}
