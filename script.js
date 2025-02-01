class WeatherApp {
    constructor() {
        this.API_KEY = '3ecde2ba5eb08201b1c156a0d09c8244';
        this.WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
        this.AQI_API_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';
        this.MIN_LOADING_TIME = 1000; 

        
        this.form = document.getElementById('search-form');
        this.cityInput = document.getElementById('city-input');
        this.locationBtn = document.getElementById('location-btn');
        this.unitToggle = document.getElementById('unit-toggle');
        this.errorMessage = document.getElementById('error-message');
        this.loading = document.getElementById('loading');
        this.weatherInfo = document.getElementById('weather-info');

        this.isMetric = true;
        this.loadingStartTime = 0;

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.locationBtn.addEventListener('click', this.handleLocation.bind(this));
        this.unitToggle.addEventListener('click', this.toggleUnit.bind(this));
    }

    showLoading() {
        this.loadingStartTime = Date.now();
        this.loading.classList.remove('hidden');
        this.weatherInfo.classList.add('hidden');
        this.errorMessage.textContent = '';
    }

    async hideLoading() {
        const elapsedTime = Date.now() - this.loadingStartTime;
        const remainingTime = Math.max(0, this.MIN_LOADING_TIME - elapsedTime);

        if (remainingTime > 0) {
            await new Promise(resolve => setTimeout(resolve, remainingTime));
        }

        this.loading.classList.add('hidden');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.weatherInfo.classList.add('hidden');
    }

    async getWeatherByCity(city) {
        try {
            const response = await fetch(
                `${this.WEATHER_API_URL}?q=${city}&appid=${this.API_KEY}&units=metric`
            );
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            await this.hideLoading();
            this.displayWeather(data);
        } catch (error) {
            await this.hideLoading();
            this.showError(error.message);
        }
    }

    async getWeatherByCoords(latitude, longitude) {
        try {
            const response = await fetch(
                `${this.WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`
            );
            if (!response.ok) {
                throw new Error('Unable to fetch weather data');
            }
            const data = await response.json();
            await this.hideLoading();
            this.displayWeather(data);
        } catch (error) {
            await this.hideLoading();
            this.showError(error.message);
        }
    }

    async getAQI(lat, lon) {
        try {
            const response = await fetch(
                `${this.AQI_API_URL}?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`
            );
            if (!response.ok) {
                throw new Error('Unable to fetch AQI data');
            }
            const data = await response.json();
            this.displayAQI(data);
        } catch (error) {
            console.error('Error in AQI fetching:', error);
            const aqivalue = document.getElementById('air-quality');
            const aqitext = document.getElementById('aqi-text');
            if (aqivalue) aqivalue.textContent = 'N/A';
            if (aqitext) aqitext.textContent = 'Not available';
        }
    }

    displayAQI(data) {
        const aqi = data.list[0]?.main.aqi;
        const aqivalue = document.getElementById('air-quality');
        const aqitext = document.getElementById('aqi-text');

        if (!aqivalue || !aqitext || !aqi) return;

        aqitext.className = 'aqi-text';

        const aqimap = {
            1: { text: 'Good', class: 'aqi-good' },
            2: { text: 'Fair', class: 'aqi-fair' },
            3: { text: 'Moderate', class: 'aqi-moderate' },
            4: { text: 'Poor', class: 'aqi-poor' },
            5: { text: 'Very Poor', class: 'aqi-very-poor' },
        };

        const aqiInfo = aqimap[aqi] || { text: 'Unknown', class: '' };

       // aqivalue.textContent = `${aqi}`;
        aqitext.textContent = aqiInfo.text;
        aqitext.classList.add(aqiInfo.class);
    }

    displayWeather(data) {
        const temperature = this.isMetric
            ? data.main.temp
            : (data.main.temp * 9) / 5 + 32;

        document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('temperature').textContent = `${Math.round(temperature)}°`;
        document.getElementById('condition').textContent = data.weather[0].main;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('wind-speed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;

        
        const iconElement = document.getElementById('weather-icon');
        iconElement.className = 'fas';

        const iconMap = {
            '01d': 'fa-sun',
            '01n': 'fa-moon',
            '02d': 'fa-cloud-sun',
            '02n': 'fa-cloud-moon',
            '03d': 'fa-cloud',
            '03n': 'fa-cloud',
            '04d': 'fa-cloud',
            '04n': 'fa-cloud',
            '09d': 'fa-cloud-showers-heavy',
            '09n': 'fa-cloud-showers-heavy',
            '10d': 'fa-cloud-rain',
            '10n': 'fa-cloud-rain',
            '11d': 'fa-bolt',
            '11n': 'fa-bolt',
            '13d': 'fa-snowflake',
            '13n': 'fa-snowflake',
            '50d': 'fa-smog',
            '50n': 'fa-smog',
        };

        if (data.weather && data.weather.length > 0) {
            iconElement.classList.add(iconMap[data.weather[0].icon] || 'fa-question');
        }

        this.weatherInfo.classList.remove('hidden');

        this.getAQI(data.coord.lat, data.coord.lon);
    }

    async handleSubmit(e) {
        e.preventDefault();
        const city = this.cityInput.value.trim();

        if (city) {
            this.showLoading();
            await this.getWeatherByCity(city);
        }
    }

    async handleLocation() {
        if (navigator.geolocation) {
            this.showLoading();
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    await this.getWeatherByCoords(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                },
                async () => {
                    await this.hideLoading();
                    this.showError('Unable to get your location');
                }
            );
        } else {
            this.showError('Geolocation is not supported by your browser');
        }
    }

    toggleUnit() {
        this.isMetric = !this.isMetric;
        this.unitToggle.textContent = this.isMetric ? '°C' : '°F';

        if (!this.weatherInfo.classList.contains('hidden')) {
            const temperatureElement = document.getElementById('temperature');
            const currentTemp = parseFloat(temperatureElement.textContent.replace('°', ''));

            if (this.isMetric) {
                temperatureElement.textContent = `${Math.round((currentTemp - 32) * 5 / 9)}°`;
            } else {
                temperatureElement.textContent = `${Math.round((currentTemp * 9 / 5) + 32)}°`;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new WeatherApp();
});
