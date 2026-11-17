import {initTheme} from './theme.js';
import {fetchRestaurants, fetchRestaurantMenu} from './api.js';
import {renderRestaurantslist, renderDailyMenu, renderWeeklyMenu} from './render.js';

initTheme();
toggleSettings();

const restaurantMenu = document.getElementById('restaurant-menu');
const restaurantDetails = document.getElementById('restaurant-details');
const restaurantName = document.getElementById('restaurant-name');
const restaurantCompany = document.getElementById('restaurant-company');
const errorDialog = document.getElementById('error-dialog');
const restaurantAddress = document.getElementById('restaurant-address');
const menuStatus = document.getElementById('menu-status');

const state = {
  //state to keep the restaurants once fetched.
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
    const button = event.target.closest('button');
    if (!button) return;
    state.currentID = button.dataset.id;
    const restaurant = state.restaurants.find((r) => r._id === state.currentID); // find the restaurant object from the state
    if (restaurant) {
      restaurantName.textContent = restaurant.name;
      restaurantCompany.textContent = restaurant.company; // set the company name
      restaurantAddress.textContent = `${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}`;
      restaurantDetails.showModal();
      await loadMenu();
    }
  });

async function loadMenu() {
  const type = document.querySelector('input[name="menu-type"]:checked').value;
  menuStatus.textContent = 'Loading menu...';
  restaurantMenu.replaceChildren(); // clear possible previous menu
  try {
    const requestedId = state.currentID;
    const menu = await fetchRestaurantMenu(requestedId, type, state.lang);
    if (requestedId !== state.currentID) {
      // user has selected another restaurant while we were fetching the menu
      console.warn('Menu fetched for a different restaurant, ignoring.');
      return;
    }
    menuStatus.textContent = '';
    if (type === 'daily') renderDailyMenu(menu.courses, restaurantMenu);
    else renderWeeklyMenu(menu.days, restaurantMenu);
  } catch (error) {
    if (requestedId !== state.currentID) {
      return; // user has selected another restaurant while we were fetching the menu
    }
    console.error('Error fetching menu:', error);
    menuStatus.textContent = 'Error loading menu.';
  }
}

// top level await works because main.js is loaded as a module
await loadRestaurants();
