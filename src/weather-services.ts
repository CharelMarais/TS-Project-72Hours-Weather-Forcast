const BASE_URL = 'http://www.7timer.info/bin/api.pl?';

export function getWeatherFromLocation(lat: number,lon: number) {
    return fetch(`${BASE_URL}lon=${lat}&lat=${lon}&product=astro&output=json`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
    });
  }