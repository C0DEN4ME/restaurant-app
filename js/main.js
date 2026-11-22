import {initTheme} from './theme.js';
import {fetchRestaurants, fetchRestaurantMenu} from './api.js';
import {
  renderRestaurantslist,
  renderDailyMenu,
  renderWeeklyMenu,
  renderCities,
} from './render.js';
import {distanceInKm, getUserPosition} from './utils.js';
import {
  loginUser,
  registerUser,
  fetchUserProfile,
  checkUserNameAvailability,
} from './api.js';

initTheme();
toggleSettings();

const restaurantMenu = document.getElementById('restaurant-menu');
const restaurantDetails = document.getElementById('restaurant-details');
const restaurantName = document.getElementById('restaurant-name');
const restaurantCompany = document.getElementById('restaurant-company');
const errorDialog = document.getElementById('error-dialog');
const restaurantAddress = document.getElementById('restaurant-address');
const menuStatus = document.getElementById('menu-status');
const retryButton = document.getElementById('retry-button');
const citySelect = document.getElementById('city-filter');
const companySelect = document.getElementById('company-filter');
const sortSelect = document.getElementById('sort-select');
const locationStatus = document.getElementById('location-status');
const loginButton = document.getElementById('login-button');
const loginDialog = document.getElementById('login-dialog');
const profileDialog = document.getElementById('profile-dialog');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const registerForm = document.getElementById('register-form');
const showRegisterButton = document.getElementById('show-register-button');
const registerUsername = document.getElementById('register-username');
const usernameStatus = document.getElementById('username-status');
const registerPrompt = document.getElementById('register-prompt');

retryButton.addEventListener('click', retryLoadRestaurants);

citySelect.addEventListener('change', applyFilters);
companySelect.addEventListener('change', applyFilters);

document
  .getElementById('menu-type-fieldset')
  .addEventListener('change', loadMenu);

sortSelect.addEventListener('change', async () => {
  if (sortSelect.value === 'distance' && !state.userPosition) {
    locationStatus.textContent = 'Getting your location...';
    try {
      const currentUserPosition = await getUserPosition();
      state.userPosition = {
        latitude: currentUserPosition.coords.latitude,
        longitude: currentUserPosition.coords.longitude,
      };
      addDistanceInfo();
      locationStatus.textContent = '';
    } catch (error) {
      console.error('Error getting user position:', error);
      locationStatus.textContent = 'Could not get your location.';
      sortSelect.value = 'name'; // fallback to name sorting
    }
  }
  applyFilters(); // re-apply filters to sort by distance
});

const state = {
  //state to keep the restaurants once fetched.
  restaurants: [],
  currentID: null,
  lang: 'fi',
  userPosition: null,
  user: null, // to store the logged-in user infol
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
    addDistanceInfo(); // add distance info if user position is available
    renderCities(state.restaurants); // render cities for filtering
    applyFilters(); // apply filters to render the restaurant list
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
  const requestedId = state.currentID;
  try {
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

async function retryLoadRestaurants() {
  errorDialog.close();
  await loadRestaurants();
}
function applyFilters() {
  const selectedCity = citySelect.value;
  const selectedCompany = companySelect.value;

  const visibleRestaurants = state.restaurants.filter(
    (r) =>
      (selectedCity === '' || r.city === selectedCity) &&
      (selectedCompany === '' || r.company === selectedCompany)
  );
  if (sortSelect.value === 'distance' && state.userPosition) {
    visibleRestaurants.sort((a, b) => a.distance - b.distance);
  } else {
    visibleRestaurants.sort((a, b) => a.name.localeCompare(b.name, 'fi'));
  }
  renderRestaurantslist(visibleRestaurants);
}

function addDistanceInfo() {
  if (!state.userPosition) return; // user position not available
  for (const restaurant of state.restaurants) {
    const [lng, lat] = restaurant.location.coordinates;
    restaurant.distance = distanceInKm(
      state.userPosition.latitude,
      state.userPosition.longitude,
      lat,
      lng
    );
  }
}

function updateLoginStatus() {
  loginButton.textContent = state.user ? state.user.username : 'Login';
}
loginButton.addEventListener('click', () => {
  if (state.user) profileDialog.showModal();
  else loginForm.hidden = false; // show login form
  registerForm.hidden = true; // hide register form
  loginDialog.showModal();
});
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // prevent form from submitting by default
  loginError.hidden = true; // hide previous error message
  const credentials = Object.fromEntries(new FormData(loginForm)); // get form data as an object
  try {
    const result = await loginUser(credentials);
    localStorage.setItem('token', result.token); // store the token in localStorage
    state.user = result.data; // store the logged-in user info in state
    updateLoginStatus();
    loginForm.reset(); // reset the form fields
    loginDialog.close();
  } catch (error) {
    console.error('Login failed:', error);
    loginError.textContent = 'Wrong username or password.'; // show a generic error message
    loginError.hidden = false; // show the error message
  }
});
showRegisterButton.addEventListener('click', () => {
  loginForm.hidden = true;
  registerForm.hidden = false;
  registerPrompt.hidden = true; // show the register prompt
});
registerUsername.addEventListener('blur', async () => {
  const username = registerUsername.value.trim();
  if (!username) return;
  try {
    const available = await checkUserNameAvailability(username);
    usernameStatus.textContent = available ? true : false;
  } catch (error) {
    usernameStatus.textContent = ''; // the check is a nice-to-have; the server still checks on submit
  }
});

await loadRestaurants();
