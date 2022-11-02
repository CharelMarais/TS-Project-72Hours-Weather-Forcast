const BASE_URL = 'https://www.7timer.info/bin/astro.php?';

export function getWeatherFromLocation(
  lon: number,
  lat: number
): Promise<Response> {
  return fetch(
    `${BASE_URL}lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`
  );
}
