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

export function calculateMostPrevalentPrecipitationType(
  precArray: string[]
): string {
  precArray.sort();
  let maxString = precArray[0];
  let maxUnchangedCount = 0;
  let currentCount = 0;
  let currentString = precArray[0];
  for (let current of precArray) {
    if (current === currentString) {
      currentCount++;
    } else {
      if (currentCount > maxUnchangedCount) {
        maxUnchangedCount = currentCount;
        maxString = currentString;
      }
      currentCount = 1;
      currentString = current;
    }
  }
  if (currentCount > maxUnchangedCount) {
    maxUnchangedCount = currentCount;
    maxString = currentString;
  }

  return maxString;
}

// function that takes cloud cover, precipitation and time to get related icon string
export function calculateCorrectCityWeatherIcon(
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
  } else if (precType === 'snow') {
    if (time > 5 && time < 19) {
      // Day Time
      iconString = 'f065';
    } else {
      // Night Time
      iconString = 'f066';
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
export function calculateWindSpeed(speed: number): number {
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
export function returnDayOfTheWeek(day: number): string {
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
createWeatherReport72Hours('Pretoria');
