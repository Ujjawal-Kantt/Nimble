const axios = require('axios');
require('dotenv').config();

async function getWeather(city) {
    if (!city || typeof city !== 'string') {
        throw new Error('Invalid city name for weather lookup');
    }

    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        console.log("Using API key:", process.env.OPENWEATHER_API_KEY);

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url);
        const data = response.data;

        const weatherInfo = {
            location: `${data.name}, ${data.sys.country}`,
            temperature: `${data.main.temp}°C`,
            feelsLike: `${data.main.feels_like}°C`,
            description: data.weather[0].description,
            humidity: `${data.main.humidity}%`,
            windSpeed: `${data.wind.speed} m/s`
        };

        return `
🌤️ Weather in **${weatherInfo.location}**:
- Temperature: ${weatherInfo.temperature}
- Feels Like: ${weatherInfo.feelsLike}
- Condition: ${weatherInfo.description}
- Humidity: ${weatherInfo.humidity}
- Wind Speed: ${weatherInfo.windSpeed}
        `.trim();
    } catch (error) {
        console.error('Error fetching weather:', error.message);
        throw new Error('Could not fetch weather data. Please check the city name.');
    }
}

module.exports = { getWeather };
