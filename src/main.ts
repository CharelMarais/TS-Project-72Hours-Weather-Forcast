import './style.css';
import { TimeZoneRootObject } from './models';
import { getLocationInfoFromCoordinates } from './timezone-services';
import {
  customCity,
  createWeatherReport72Hours,
  updateCurrentCityWeather,
} from './dom-manipulation';

// Time is intialize at 00 GMT

// Function to return timezone offset of a city
export function setCustomCityTimeZone(): void {
  getLocationInfoFromCoordinates(
    customCity.longitude,
    customCity.latitude
  ).then((response) => {
    if (response.ok) {
      response.json().then((jsonResponse: TimeZoneRootObject) => {
        customCity.gmtDiff = jsonResponse.timezone_offset;
      });
    }
  });
}

// call functions
updateCurrentCityWeather();
createWeatherReport72Hours('Pretoria');
