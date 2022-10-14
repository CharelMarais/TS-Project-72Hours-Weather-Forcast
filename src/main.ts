import './style.css';
import { getWeatherFromLocation } from './weather-services';

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

// Locations that can be selected at City's to view weather
const johannesburg = {
  name: 'Johannesburg',
  longitude: 28.04,
  latitude: -26.2,
  time: currentGmtTime + 2,
  gmtDiff: 2,
};
const hongKong = {
  name: 'Hong Kong',
  longitude: 113.46,
  latitude: 22.99,
  time: currentGmtTime + 8,
  gmtDiff: 8,
};
const newYork = {
  name: 'New York',
  longitude: -73.99,
  latitude: 40.72,
  time: currentGmtTime - 4,
  gmtDiff: -4,
};
const london = {
  name: 'London',
  longitude: -0.11,
  latitude: 51.49,
  time: currentGmtTime + 1,
  gmtDiff: 1,
};
const sydney = {
  name: 'Sydney',
  longitude: 151.2,
  latitude: -33.87,
  time: currentGmtTime + 11,
  gmtDiff: 11,
};

// variable array to get the info stored in the variables
let cityVariables = [johannesburg, hongKong, newYork, london, sydney];

// function to update the current weather section for the City's
function updateCurrentCityWeather(cityVariablesArray: any): void {
  const cityCurrentWeatherContainer = <HTMLDivElement>(
    document.getElementById('weather-overview')
  );
  // for loop to loot thru the city's to get the info
  for (let i: number = 0; i < cityVariablesArray.length; i++) {
    const { name, longitude, latitude, time } = cityVariablesArray[i];

    // get response from API using the properties of the city variables
    getWeatherFromLocation(longitude, latitude).then((response) => {
      if (response.ok) {
        response.json().then((jsonResponse) => {
          for (let cityWeatherData of jsonResponse.dataseries) {
            // if to check for the first/latest weather report in the dataseries
            if (cityWeatherData.timepoint === 3) {
              // function to get icon to display using time and weather status
              let weatherIcon: string = calculateCorrectCityWeatherIcon(
                cityWeatherData.cloudcover,
                cityWeatherData.prec_type,
                time
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
                    <span class="city">${name}</span>
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
  console.log(iconString);
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

// function to create in display grid showing weather 72 hour update
function createDisplayGrid72Hours(city: string, cityArray: any): void {
  const weatherReportContainer = <HTMLDivElement>(
    document.getElementById('weather-report')
  );
  const weatherReportHeading = <HTMLDivElement>(
    document.getElementById('weather-report-heading')
  );
  let cityName: string = 'none';
  let lon: number = 0;
  let lat: number = 0;
  let gmtDifference: number;

  // for loop used to get related info from selected city
  for (let i: number = 0; i < cityArray.length; i++) {
    if (city === cityArray[i].name) {
      const { name, longitude, latitude, gmtDiff } = cityArray[i];
      cityName = name;
      lon = longitude;
      lat = latitude;
      gmtDifference = gmtDiff;
    }
  }

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
              (gmtDifference + weatherData.timepoint - 2) * 60 * 60 * 1000
          );

          let timePointHour: number = currentTimeReading.getHours();
          let timePointDay: number = currentTimeReading.getDay();

          weatherReportContainer.innerHTML += `
            <div id="grid-item" class="report-grid-item">
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
      });
    }
  });
}
// call functions
updateCurrentCityWeather(cityVariables);
createDisplayGrid72Hours('Johannesburg', cityVariables);

// temp area Dirty Code

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
