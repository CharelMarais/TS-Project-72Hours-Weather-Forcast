import './style.css';
import { getWeatherFromLocation } from './weather-services';

// Time is intialize at 00 GMT

// arrays to save data fetched from API
let weatherTimestamp: number[] = [];
let weatherTemperature: number[] = [];
let weatherPrecipitationType: string[] = [];
let weatherCloudCover: number[] = [];
let weatherHumidity: number[] = [];
let weatherWindDirection: string[] = [];
let weatherWindSpeed: number[] = [];

// get current hour for GMT time
let currDate = new Date();
let currentGmtTime: number = currDate.getHours() - 2;

export interface City {
  name: string;
  longitude: number;
  latitude: number;
  time: number;
  gmtDiff: number;
}

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

// variable array to get the info stored in the variables
const cityVariables: City[] = [pretoria, hongKong, newYork, london, sydney];

// function to update the current weather section for the City's
export function updateCurrentCityWeather(): void {
  const cityCurrentWeatherContainer = <HTMLDivElement>(
    document.getElementById('weather-overview')
  );
  // for loop to loot thru the city's to get the info
  for (let i: number = 0; i < cityVariables.length; i++) {
    const { name, longitude, latitude, time, gmtDiff } = cityVariables[i];

    // get response from API using the properties of the city variables
    getWeatherFromLocation(longitude, latitude).then((response) => {
      if (response.ok) {
        response.json().then((jsonResponse) => {
          for (let cityWeatherData of jsonResponse.dataseries) {
            // if to check for the first/latest weather report in the dataseries
            if (
              cityWeatherData.timepoint === time + gmtDiff ||
              cityWeatherData.timepoint === time + gmtDiff + 1 ||
              cityWeatherData.timepoint === time + gmtDiff - 1
            ) {
              // function to get icon to display using time and weather status
              let weatherIcon: string = calculateCorrectCityWeatherIcon(
                cityWeatherData.cloudcover,
                cityWeatherData.prec_type,
                time + gmtDiff
              );

              // function that returns speed in relation to wind speed rating
              let windSpeed: number = calculateWindSpeed(
                cityWeatherData.wind10m.speed
              );

              // Set innerhtml to loop for every city listed
              cityCurrentWeatherContainer.innerHTML += `
              <div class="current-weather-group">
                <div class="city-current-weather">
                  <div class="city-temperature-area">
                    <span class="temperature">${cityWeatherData.temp2m}&#730;</span>
                    <button class="city" id="${name}" >${name}</button>
                  </div>
                  <div class="weather-icon-area">&#x${weatherIcon};</div>
                  <div class="rain-wind-area">
                    <span class="wind-direction">${cityWeatherData.wind10m.direction}</span>
                    <span class="wind-icon">&#xf050;</span>
                    <span class="wind">+${windSpeed} m/s</span>
                  </div>
                </div>
              </div>`;
            }
          }
        });
      }
    });
  }
}

// function to create in display grid showing weather 72 hour update
function createWeatherReport72Hours(city: string): void {
  const weatherReportContainer = <HTMLDivElement>(
    document.getElementById('weather-report')
  );
  const weatherReportHeading = <HTMLDivElement>(
    document.getElementById('weather-report-heading')
  );
  const weatherInfo = <HTMLDivElement>(
    document.getElementById('weather-info-container')
  );

  let cityName: string = 'none';
  let lon: number = 0;
  let lat: number = 0;
  let gtmTime = 0;
  let gmtDifference: number;

  // for loop used to get related info from selected city
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

  // Updating map
  let map = L.map('map').setView([lat, lon], 6);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  let marker = L.marker([lat, lon]).addTo(map);

  // Update weather info

  // set innerHTML to update regarding responses from the API
  weatherReportHeading.innerHTML! += `${cityName} Weather Report 72 Hours`;
  getWeatherFromLocation(lon, lat).then((response) => {
    if (response.ok) {
      response.json().then((jsonResponse) => {
        for (let weatherData of jsonResponse.dataseries) {
          // Dates used to add timepoint hours to current time and to get day of the week and time at each time point
          let currentTimeReading: Date = new Date();
          currentTimeReading.setTime(
            currentTimeReading.getTime() +
              (gmtDifference + weatherData.timepoint - 2 - gtmTime) *
                60 *
                60 *
                1000
          );

          let timePointHour: number = currentTimeReading.getHours();
          let timePointDay: number = currentTimeReading.getDay();

          weatherReportContainer.innerHTML += `
            <div class="report-grid-item">
              <div class="grid-item-icon-block">
                <div class="grid-weather-icon">&#x${calculateCorrectCityWeatherIcon(
                  weatherData.cloudcover,
                  weatherData.prec_type,
                  timePointHour
                )}</div>
                <div class="grid-timestamp">
                ${returnDayOfTheWeek(timePointDay)} ${timePointHour}:00
                </div>
              </div>
              <div class="grid-item-temperature">
                ${weatherData.temp2m}&#730
              </div>
            </div>
            `;
        }
        weatherInfo.innerHTML += `<div>test</div>`;
      });
    }
  });
}

// function that takes cloud cover, precipitation and time to get related icon string
function calculateCorrectCityWeatherIcon(
  cloudCover: number,
  precType: string,
  time: number
): string {
  let iconString: string;

  if (precType === 'rain') {
    if (time > 5 && time < 19) {
      // Day Time
      iconString = 'f008';
    } else {
      // Night Time
      iconString = 'f036';
    }
  } else {
    if (time > 5 && time < 19) {
      // Day Time
      if (cloudCover < 3) {
        iconString = 'f00d';
      } else if (cloudCover > 7) {
        iconString = 'f002';
      } else {
        iconString = 'f00c';
      }
    } else {
      // Night Time
      if (cloudCover < 3) {
        iconString = 'f02e';
      } else if (cloudCover > 7) {
        iconString = 'f031';
      } else {
        iconString = 'f083';
      }
    }
  }
  return iconString;
}

// function that takes windspeed and returns the related speed in m/s
function calculateWindSpeed(speed: number): number {
  let calculatedSpeed: number;

  switch (speed) {
    case 1:
      calculatedSpeed = 0;
      break;
    case 2:
      calculatedSpeed = 0.3;
      break;
    case 3:
      calculatedSpeed = 3.4;
      break;
    case 4:
      calculatedSpeed = 8.0;
      break;
    case 5:
      calculatedSpeed = 10.8;
      break;
    case 6:
      calculatedSpeed = 17.2;
      break;
    case 7:
      calculatedSpeed = 24.5;
      break;
    case 8:
      calculatedSpeed = 32.6;
      break;
    default:
      calculatedSpeed = 0;
      break;
  }
  return calculatedSpeed;
}

// function to return day of the week
function returnDayOfTheWeek(day: number): string {
  switch (day) {
    case 0:
      return 'Sun';
    case 1:
      return 'Mon';
    case 2:
      return 'Tue';
    case 3:
      return 'Wen';
    case 4:
      return 'Thu';
    case 5:
      return 'Fri';
    case 6:
      return 'Sat';
    default:
      return 'none';
  }
}

// call functions

updateCurrentCityWeather();
createWeatherReport72Hours('New York');

const cityButtons = Array.from(document.getElementsByName('.city'));

cityButtons.forEach((city) => {
  city.addEventListener('click', () => console.log('test'));
});

// const pretoriaButton = <HTMLButtonElement>document.getElementById('Pretoria');
// const hongKongButton = <HTMLButtonElement>document.getElementById('Hong Kong');
// const newYorkButton = <HTMLButtonElement>document.getElementById('New York');
// const londonButton = <HTMLButtonElement>document.getElementById('London');
// const sydneyButton = <HTMLButtonElement>document.getElementById('Sydney');
// pretoriaButton!.addEventListener('click', () => {
//   createDisplayGrid72Hours('Pretoria');
//   console.log('Test');
// });
// hongKongButton!.addEventListener('click', () =>
//   createDisplayGrid72Hours('Hong Kong')
// );
// londonButton!.addEventListener('click', () =>
//   createDisplayGrid72Hours('London')
// );
// newYorkButton!.addEventListener('click', () =>
//   createDisplayGrid72Hours('New York')
// );
// sydneyButton!.addEventListener('click', () =>
//   createDisplayGrid72Hours('Sydney')
// );

// temp area Dirty Code
//------------------------------------------------------------------------------------------------------------------

getWeatherFromLocation(20, 20).then((response) => {
  if (response.ok) {
    response.json().then((jsonResponse) => {
      console.log(jsonResponse);
      for (let weatherData of jsonResponse.dataseries) {
        // weatherTimestamp.push(weatherData.timepoint);
        // weatherTemperature.push(weatherData.temp2m);
        // weatherPrecipitationType.push(weatherData.prec_type);
        // weatherCloudCover.push(weatherData.cloudcover);
        // weatherHumidity.push(weatherData.rh2m);
        // weatherWindDirection.push(weatherData.wind10m.direction);
        // weatherWindSpeed.push(weatherData.wind10m.speed);
      }
    });
  }
});
