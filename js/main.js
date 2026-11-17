import {initTheme} from './theme.js';
import {fetchRestaurants, fetchRestaurantMenu} from './api.js';
import {renderRestaurantslist, renderDailyMenu} from './render.js';

initTheme();
toggleSettings();

const restaurantMenu = document.getElementById('restaurant-menu');
const restaurantDetails = document.getElementById('restaurant-details');
const restaurantName = document.getElementById('restaurant-name');
const restaurantCompany = document.getElementById('restaurant-company');
const errorDialog = document.getElementById('error-dialog');
const restarauntAddress = document.getElementById('restaurant-address');

const state = {
  // global state to keep the restaurants once fetched.
  restaurants: [],
  currentID: null,
  lang: 'fi',
};

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
    state.restaurants = await fetchRestaurants();
    renderRestaurantslist(state.restaurants);
    console.log('Fetched restaurants:', state.restaurants); // keep for debugging
  } catch (error) {
    console.error('Error loading restaurants:', error);
    errorDialog.showModal();
  }
}

// one listener for the whole list, easier than adding one to every button
document
  .getElementById('restaurant-list')
  .addEventListener('click', async function (event) {
    // closest() needed, otherwise clicking the text inside the button doesnt work
    const button = event.target.closest('button');
    if (!button) return;
    const restaurantId = button.dataset.id;
    state.currentID = button.dataset.id;
    const restaurant = state.restaurants.find((r) => r._id === state.currentID); // find the restaurant object from the state
    // daily or weekly
    const type = document.querySelector(
      'input[name="menu-type"]:checked'
    ).value;
    try {
      // TODO: language is hardcoded to finnish for now
      const menu = await fetchRestaurantMenu(restaurantId, type, 'fi');
      restaurantName.textContent = restaurant.name;
      restarauntAddress.textContent = `${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}`;
      restaurantCompany.textContent = restaurant.company;
      renderDailyMenu(menu.courses, restaurantMenu);
      restaurantDetails.showModal();
      console.log('Menu: ', menu);
    } catch (error) {
      console.error('Error fetching restaurant menu:', error);
    }
  });

// top level await works because main.js is loaded as a module
await loadRestaurants();
