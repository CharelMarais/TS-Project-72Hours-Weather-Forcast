const BASE_URL =
  'https://api.ipgeolocation.io/timezone?apiKey=71b91fdefb5d403ca1ff9c3d035b1f5c&';

export function getLocationInfoFromCoordinates(lon: number, lat: number) {
  return fetch(`${BASE_URL}lat=${lat}&long=${lon}`);
}
