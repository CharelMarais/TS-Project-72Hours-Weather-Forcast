import './style.css';
import { getWeatherFromLocation } from './weather-services';

//const weatherReport =document.querySelector<HTMLDivElement>('#weather-report');
let weatherTimestamp: number[] = [];
let weatherTempreture: number[] = [];
let weatherPrecipitationType: string[] = [];
let weatherCloudCover: number[] = [];
let weatherHumidity: number[] = [];
let weatherWindDirection: string[] = [];
let weatherWindSpeed: number[] = [];

getWeatherFromLocation(20, 20).then((response) => {
  if (response.ok) {
    response.json().then((jsonResponse) => {
      for (let weatherData of jsonResponse.dataseries) {
        weatherTimestamp.push(weatherData.timepoint);
        weatherTempreture.push(weatherData.temp2m);
        weatherPrecipitationType.push(weatherData.prec_type);
        weatherCloudCover.push(weatherData.cloudcover);
        weatherHumidity.push(weatherData.rh2m);
        weatherWindDirection.push(weatherData.wind10m.direction);
        weatherWindSpeed.push(weatherData.wind10m.speed);
      }
    });
  }
});

console.log('test');
