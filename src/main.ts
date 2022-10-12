import './style.css'
import { getWeatherFromLocation } from './weather-services';

const weatherReport =document.querySelector<HTMLDivElement>('#weather-report');

getWeatherFromLocation(20,20).then((response) => {
    if (response.ok) {
      response.json().then((jsonResponse) => {
        for (let data of jsonResponse.results) {
            console.log(data.init)
        }
      });
    }
});
