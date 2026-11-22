// leaflet stuff only here, rest of the app is my own js

let map = null;
let marker = null;

export function showRestaurantMap(restaurant) {
  // api gives [lng, lat], leaflet wants [lat, lng]!
  const [lng, lat] = restaurant.location.coordinates;

  // make the map only once, a second L.map on the same div throws
  if (!map) {
    map = L.map('restaurant-map');
    // osm tiles, attribution is required
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    marker = L.marker([lat, lng]).addTo(map);
  }
  map.invalidateSize();
  marker.setLatLng([lat, lng]);
  map.setView([lat, lng], 16); // 16 ~ street level
}
