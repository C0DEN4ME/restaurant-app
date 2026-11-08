import {initTheme} from './theme.js';
import {fetchRestaurants, fetchRestaurantMenu} from './api.js';
import {renderRestaurantslist, renderDailyMenu} from './render.js';

initTheme();
toggleSettings();

function toggleSettings() {
  const settingsButton = document.getElementById('settings-button');
  const settingsPanel = document.getElementById('settings-dialog');
  settingsButton.addEventListener('click', () => {
    settingsPanel.showModal();
  });
}

// fetch restaurants and render the list
async function loadRestaurants() {
  try {
    const restaurants = await fetchRestaurants();
    renderRestaurantslist(restaurants);
    console.log('Fetched restaurants:', restaurants); // keep for debugging
  } catch (error) {
    console.error('Error loading restaurants:', error);
  }
}
const restaurantMenu = document.getElementById('restaurant-menu');
const restaurantDetails = document.getElementById('restaurant-details');

// one listener for the whole list, easier than adding one to every button
document
  .getElementById('restaurant-list')
  .addEventListener('click', async function (event) {
    // closest() needed, otherwise clicking the text inside the button doesnt work
    const button = event.target.closest('button');
    if (!button) return;
    const restaurantId = button.dataset.id;
    // daily or weekly
    const type = document.querySelector(
      'input[name="menu-type"]:checked'
    ).value;
    try {
      // TODO: language is hardcoded to finnish for now
      const menu = await fetchRestaurantMenu(restaurantId, type, 'fi');
      renderDailyMenu(menu.courses, restaurantMenu);
      restaurantDetails.showModal();
      console.log('Menu: ', menu);
    } catch (error) {
      console.error('Error fetching restaurant menu:', error);
    }
  });

// top level await works because main.js is loaded as a module
await loadRestaurants();
