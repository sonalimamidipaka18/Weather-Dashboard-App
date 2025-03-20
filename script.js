const apiKey = '5636ad92b26927cfcb14cb5e00577349'; // Replace with your OpenWeather API key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

// On page load, fetch default weather
window.onload = () => {
  fetchWeather('auto:ip'); // Use OpenWeather's IP-based geolocation
};

// Event listener for search
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
    fetchForecast(city);
  }
});

// Fetch current weather
function fetchWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
      updateBackground(data.weather[0].main.toLowerCase());
    })
    .catch(error => {
      console.error('Error fetching weather:', error);
      alert('Unable to fetch weather for the specified location.');
    });
}

// Display current weather
function displayWeather(data) {
  const weatherElement = document.getElementById('current-weather');
  weatherElement.innerHTML = `
    <h2>${data.name}</h2>
    <p>${data.weather[0].description}</p>
    <h1>${data.main.temp}°C</h1>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

// Fetch 4-day forecast
function fetchForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    })
    .catch(error => {
      console.error('Error fetching forecast:', error);
    });
}

// Display 4-day forecast
function displayForecast(data) {
  const forecastContainer = document.getElementById('forecast-cards');
  forecastContainer.innerHTML = ''; // Clear previous forecast

  // Filter forecast data for the next 4 days at 12:00 PM
  const filteredForecast = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 4);
  filteredForecast.forEach(item => {
    const date = new Date(item.dt_txt).toLocaleDateString();
    forecastContainer.innerHTML += `
      <div class="forecast-card">
        <p>${date}</p>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
        <p>${item.weather[0].description}</p>
        <h3>${item.main.temp}°C</h3>
      </div>
    `;
  });
}

// Update background based on weather condition
function updateBackground(condition) {
  document.body.className = ''; // Reset previous classes
  if (condition.includes('rain')) {
    document.body.classList.add('rainy');
  } else if (condition.includes('clear')) {
    document.body.classList.add('sunny');
  } else if (condition.includes('cloud')) {
    document.body.classList.add('cloudy');
  } else if (condition.includes('snow')) {
    document.body.classList.add('snowy');
  } else {
    document.body.classList.add('clear'); // Default to clear
  }
}
