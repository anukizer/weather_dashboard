const apiKey = 'cb1eb157f58f68a124ece3372a6c22f2'
const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast'

const cityInput = document.querySelector('#city-input')
const searchForm = document.querySelector('#search-form')
const searchHistory = document.querySelector('#search-history')
const currentWeather = document.querySelector('#current-weather')
const forecastContainer = document.querySelector('#forecast-container')

function init() {
    const savedCities = JSON.parse(localStorage.getItem("searchHistory")) || []
    const lastSearchedCity = localStorage.getItem("lastSearchedCity");

    renderSearchHistory(savedCities)

    if (lastSearchedCity) {
        fetchWeather(lastSearchedCity);
    }
}

//Fetch weather data
async function fetchWeather(city) {
    const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=imperial`

    try{
        const response = await fetch(url)
        if(!response.ok){
            throw new Error("City not fount")
        }
        const data = await response.json()
        displayWeather(data, city)
        localStorage.setItem("lastSearchedCity", city);
    } catch(error){
        console.log("#### ERROR MESSAGE ###", error.message)
        // alert(error.message)
    }
}

//Render weather data
function displayWeather(data, city){
        // Current Weather
        const current = data.list[0];
        currentWeather.innerHTML = `
            <h2>${city}</h2>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}.png" alt="${current.weather[0].description}">
            <p>Temperature: ${current.main.temp}°F</p>
            <p>Humidity: ${current.main.humidity}%</p>
            <p>Wind Speed: ${current.wind.speed} MPH</p>
        `;
    
        // 5-Day Forecast
        forecastContainer.innerHTML = "<h3>5-Day Forecast:</h3>";
        const forecast = data.list.filter((_, index) => index % 8 === 0);
        forecast.forEach(day => {
            forecastContainer.innerHTML += `
                    <div>
                        <p>Date: ${new Date(day.dt_txt).toLocaleDateString()}</p>
                        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                        <p>Temperature: ${day.main.temp}°F</p>
                        <p>Humidity: ${day.main.humidity}%</p>
                        <p>Wind Speed: ${day.wind.speed} MPH</p>
                    </div>
            `;
        });
    
}

// Save to localStorage
function saveCity(city){
    let cities = JSON.parse(localStorage.getItem("searchHistory")) || []

    if(!cities.includes(city)){
        cities.push(city)
        localStorage.setItem("searchHistory", JSON.stringify(cities))
        renderSearchHistory(cities)
    }
}


// Render Search History
function renderSearchHistory(cities){
    searchHistory.innerHTML = ""
    cities.forEach(city => {
        const button = document.createElement("button")
        button.textContent = city
        button.addEventListener('click', () => fetchWeather(city))
        searchHistory.appendChild(button)
    })
}

searchForm.addEventListener('submit', e => {
    e.preventDefault()
    const city = cityInput.value.trim()
    if(city){
        fetchWeather(city)
        saveCity(city)
        cityInput.value = ""
    }
})

init();