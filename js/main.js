import {initTheme} from './theme.js';
import {fetchRestaurants} from './api.js';
initTheme();
async function loadRestaurants() {
  try {
    const restaurants = await fetchRestaurants();
    console.log('Fetched restaurants:', restaurants);
  } catch (error) {
    console.error('Error loading restaurants:', error);
  }
}
loadRestaurants();
