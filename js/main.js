import {initTheme} from './theme.js';
import {fetchRestaurants} from './api.js';
import {renderRestaurantslist} from './render.js';
initTheme();

async function loadRestaurants() {
  try {
    const restaurants = await fetchRestaurants();
    renderRestaurantslist(restaurants);
    console.log('Fetched restaurants:', restaurants);
  } catch (error) {
    console.error('Error loading restaurants:', error);
  }
}
await loadRestaurants();
