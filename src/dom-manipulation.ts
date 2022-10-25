import './style.css';
import { getWeatherFromLocation } from './weather-services';
import { City, WeatherRootObject } from './models';
import L from 'leaflet';
import * as main from './main';
import * as utilities from './utilities';

// arrays to save data fetched from API
let weatherTemperaturesArray: number[] = [];
let weatherPrecipitationTypeArray: string[] = [];
let weatherCloudCoverArray: number[] = [];
let weatherHumidityArray: number[] = [];
let weatherWindSpeedArray: number[] = [];

// get current hour for GMT time
let currDate = new Date();
let currentGmtTime: number = currDate.getHours() - 2;

// Locations that can be selected at City's to view weather
const pretoria: City = {
  name: 'Pretoria',
  longitude: 28.194351,
  latitude: -25.751642,
  time: currentGmtTime,
  gmtDiff: 2,
};
const hongKong: City = {
  name: 'Hong Kong',
  longitude: 114.159064,
  latitude: 22.281076,
  time: currentGmtTime,
  gmtDiff: 8,
};
const newYork: City = {
  name: 'New York',
  longitude: -74.007339,
  latitude: 40.700439,
  time: currentGmtTime,
  gmtDiff: -4,
};
const london: City = {
  name: 'London',
  longitude: -0.127287,
  latitude: 51.5065,
  time: currentGmtTime,
  gmtDiff: 1,
};
const sydney: City = {
  name: 'Sydney',
  longitude: 151.208439,
  latitude: -33.871836,
  time: currentGmtTime,
  gmtDiff: 11,
};
export const customCity: City = {
  name: 'Custom',
  longitude: 0,
  latitude: 0,
  time: currentGmtTime,
  gmtDiff: 2,
};

// variable array to get the info stored in the variables
const cityVariables: City[] = [
  pretoria,
  hongKong,
  newYork,
  london,
  sydney,
  customCity,
];

// function to update the current weather section for the City's
export function updateCurrentCityWeather(): void {
  const cityCurrentWeatherContainer = <HTMLDivElement>(
    document.getElementById('weather-overview')
  );
  // for loop to loot thru the city's to get the info
  for (let i: number = 0; i < cityVariables.length - 1; i++) {
    const { name, longitude, latitude, time, gmtDiff } = cityVariables[i];

    // get response from API using the properties of the city variables
    getWeatherFromLocation(longitude, latitude).then((response) => {
      if (response.ok) {
        response.json().then((jsonResponse: WeatherRootObject) => {
          for (let cityWeatherData of jsonResponse.dataseries) {
            // if to check for the first/latest weather report in the dataseries
            if (
              cityWeatherData.timepoint + gmtDiff === time + gmtDiff ||
              cityWeatherData.timepoint + gmtDiff === time + gmtDiff + 1 ||
              cityWeatherData.timepoint + gmtDiff === time + gmtDiff - 1
            ) {
              // function to get icon to display using time and weather status
              const weatherIcon = utilities.calculateCorrectCityWeatherIcon(
                cityWeatherData.cloudcover,
                cityWeatherData.prec_type,
                time + gmtDiff
              );

              // function that returns speed in relation to wind speed rating
              const windSpeed = utilities.calculateWindSpeed(
                cityWeatherData.wind10m.speed
              );
              // Set innerhtml to loop for every city listed
              cityCurrentWeatherContainer.innerHTML += `
                <div class="current-weather-group">
                  <div class="city-current-weather">
                    <div class="city-temperature-area">
                      <span class="temperature">${cityWeatherData.temp2m}&#730;</span>
                      <button class="city-button" id="${name}">${name}</button>
                    </div>
                    <div class="weather-icon-area">&#x${weatherIcon};</div>
                    <div class="wind-area">
                      <span class="wind-direction">${cityWeatherData.wind10m.direction}</span>
                      <span class="wind-icon">&#xf050;</span>
                      <span class="wind-speed">+${windSpeed} m/s</span>
                    </div>
                  </div>
                </div>`;
            }
          }
          Array.from(document.querySelectorAll('.city-button')).map((btn) =>
            btn.addEventListener('click', () =>
              createWeatherReport72Hours(btn.id)
            )
          );
        });
      }
    });
  }
}

// function to create in display grid showing weather 72 hour update
export function createWeatherReport72Hours(city: string): void {
  const weatherReportContainer = <HTMLDivElement>(
    document.getElementById('weather-report')
  );
  const weatherReportHeading = <HTMLDivElement>(
    document.getElementById('weather-report-heading')
  );
  const weatherInfo = <HTMLDivElement>(
    document.getElementById('weather-info-container')
  );
  weatherReportContainer.innerHTML = ``;
  weatherReportHeading.innerHTML! = ``;
  weatherInfo.innerHTML = ``;

  let cityName: string = 'none';
  let lon: number = 0;
  let lat: number = 0;
  let gtmTime = 0;
  let gmtDifference: number;

  // for loop used to get related info from selected city FIND
  for (let i: number = 0; i < cityVariables.length; i++) {
    if (city === cityVariables[i].name) {
      const { name, longitude, latitude, time, gmtDiff } = cityVariables[i];
      cityName = name;
      lon = longitude;
      lat = latitude;
      gtmTime = time;
      gmtDifference = gmtDiff;
    }
  }

  // Map Marker Update
  if (marker) {
    marker.setLatLng([lat, lon]);
  } else {
    marker = L.marker([lat, lon]).addTo(map);
  }
  map.invalidateSize();
  map.setView([lat, lon], 6);

  // Update weather info

  // set innerHTML to update regarding responses from the API
  weatherReportHeading.innerHTML! += `${cityName} Weather Report 72 Hours`;
  getWeatherFromLocation(lon, lat).then((response) => {
    if (response.ok) {
      response.json().then((jsonResponse) => {
        for (let weatherData of jsonResponse.dataseries) {
          weatherTemperaturesArray.push(weatherData.temp2m);
          weatherCloudCoverArray.push(weatherData.cloudcover);
          weatherHumidityArray.push(weatherData.rh2m);
          weatherWindSpeedArray.push(weatherData.wind10m.speed);
          weatherPrecipitationTypeArray.push(weatherData.prec_type);

          // Dates used to add timepoint hours to current time and to get day of the week and time at each time point
          const currentTimeReading: Date = new Date();
          currentTimeReading.setTime(
            currentTimeReading.getTime() +
              (gmtDifference + weatherData.timepoint - 2 - gtmTime) *
                60 *
                60 *
                1000
          );

          const timePointHour: number = currentTimeReading.getHours();
          const timePointDay: number = currentTimeReading.getDay();

          weatherReportContainer.innerHTML += `
              <div class="report-grid-item">
                <div class="grid-item-icon-block">
                  <div class="grid-weather-icon">&#x${utilities.calculateCorrectCityWeatherIcon(
                    weatherData.cloudcover,
                    weatherData.prec_type,
                    timePointHour
                  )}</div>
                  <div class="grid-timestamp">
                  ${utilities.returnDayOfTheWeek(
                    timePointDay
                  )} ${timePointHour}:00
                  </div>
                </div>
                <div class="grid-item-temperature">
                  ${weatherData.temp2m}&#730
                </div>
              </div>
              `;
        }

        // Set info that gets showed for the weather info screen

        const maxTemp: number = Math.max(...weatherTemperaturesArray);
        const minTemp: number = Math.min(...weatherTemperaturesArray);
        const avgTemp: number =
          weatherTemperaturesArray.reduce((a, b) => a + b, 0) /
          weatherTemperaturesArray.length;
        const avgCloudCover: number =
          weatherCloudCoverArray.reduce((a, b) => a + b, 0) /
          weatherCloudCoverArray.length;
        const avgWindSpeed: number =
          weatherWindSpeedArray.reduce((a, b) => a + b, 0) /
          weatherWindSpeedArray.length;

        const mostPrevalentPrecType: string =
          utilities.calculateMostPrevalentPrecipitationType(
            weatherPrecipitationTypeArray
          );

        weatherInfo.innerHTML += `
          <div class="info-icon-container">
            <span class="info-headings">Most Prevalent Precipitation: ${
              mostPrevalentPrecType === 'none' ? 'clear' : mostPrevalentPrecType
            }</span>
            <span class="info-icon">&#x${utilities.calculateCorrectCityWeatherIcon(
              Math.round(avgCloudCover),
              mostPrevalentPrecType,
              12
            )}</span>
          </div>
          <div class="info-grid">
            <div class="info">
              <span class="info-headings">Max Temperature</span>
              <span class="info-details">${maxTemp}&#730</span>
            </div>
            <div class="info">
              <span class="info-headings">Min Temperature</span>
              <span class="info-details">${minTemp}&#730</span>
            </div>
            <div class="info">
              <span class="info-headings">Average Temperature</span>
              <span class="info-details">${Math.round(avgTemp)}&#730</span>
            </div>
            <div class="info">
              <span class="info-headings">Average Wind Speed</span>
              <span class="info-details">+${utilities.calculateWindSpeed(
                Math.round(avgWindSpeed)
              )} <span style="font-size: 20px;">m/s</span></span>
            </div>
          </div>`;

        // clear arrays for next iteration

        weatherCloudCoverArray = [];
        weatherHumidityArray = [];
        weatherPrecipitationTypeArray = [];
        weatherTemperaturesArray = [];
        weatherWindSpeedArray = [];
      });
    }
  });
}

// Initializing map
let map = L.map('map').setView([pretoria.latitude, pretoria.longitude], 6);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
let marker: L.Marker;

// Onmap Click event to show custom weather for marked area
map.on('click', function (ev) {
  customCity.latitude = ev.latlng.lat;
  customCity.longitude = ev.latlng.lng;
  main.setCustomCityTimeZone();
  marker.setLatLng(ev.latlng); // ev is an event object (MouseEvent in this case)

  setTimeout(function () {
    createWeatherReport72Hours('Custom');
  }, 500);
});
