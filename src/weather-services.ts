const BASE_URL = 'https://www.7timer.info/bin/astro.php?';

export function getWeatherFromLocation(lat: number, lon: number) {
  return fetch(
    `${BASE_URL}lon=${lat}&lat=${lon}&ac=0&unit=metric&output=json&tzshift=0`
    // , {
    //     headers : {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //        }
    // }
  );
}
