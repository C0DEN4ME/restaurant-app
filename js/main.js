import {initTheme} from './theme.js';
import {
  fetchRestaurants,
  fetchRestaurantMenu,
  loginUser,
  registerUser,
  fetchUserProfile,
  checkUserNameAvailability,
  updateUserProfile,
} from './api.js';
import {
  renderRestaurantslist,
  renderDailyMenu,
  renderWeeklyMenu,
  renderCities,
} from './render.js';
import {distanceInKm, getUserPosition} from './utils.js';
import {t, setLanguage, applyLanguage} from './lang.js';
import {showRestaurantMap} from './map.js';

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
const registerError = document.getElementById('register-error');
const logoutButton = document.getElementById('logout-button');
const favouriteButton = document.getElementById('favourite-button');
const loginTitle = document.getElementById('login-title');

retryButton.addEventListener('click', retryLoadRestaurants);

citySelect.addEventListener('change', applyFilters);
companySelect.addEventListener('change', applyFilters);

document
  .getElementById('menu-type-fieldset')
  .addEventListener('change', loadMenu);

sortSelect.addEventListener('change', async () => {
  if (sortSelect.value === 'distance' && !state.userPosition) {
    locationStatus.textContent = t('gettingLocation');
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
      locationStatus.textContent = t('locationError');
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
  user: null, // logged in user, null when logged out
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
      restaurantCompany.textContent = restaurant.company;
      restaurantAddress.textContent = `${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}`;
      updateFavouriteButton();
      restaurantDetails.showModal();
      showRestaurantMap(restaurant); // after showModal or the map gets 0 size
      await loadMenu();
    }
  });

async function loadMenu() {
  const type = document.querySelector('input[name="menu-type"]:checked').value;
  menuStatus.textContent = t('loadingMenu');
  restaurantMenu.replaceChildren(); // clear possible previous menu
  const requestedId = state.currentID;
  try {
    const menu = await fetchRestaurantMenu(requestedId, type, state.lang);
    if (requestedId !== state.currentID) {
      // another restaurant was clicked while loading, ignore this one
      console.warn('Menu fetched for a different restaurant, ignoring.');
      return;
    }
    menuStatus.textContent = '';
    if (type === 'daily') renderDailyMenu(menu.courses, restaurantMenu);
    else renderWeeklyMenu(menu.days, restaurantMenu);
  } catch (error) {
    if (requestedId !== state.currentID) {
      return; // another restaurant was clicked while loading, ignore this one
    }
    console.error('Error fetching menu:', error);
    menuStatus.textContent = t('menuError');
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
  const favouriteID = state.user?.favouriteRestaurant;
  const favouriteIndex = visibleRestaurants.findIndex(
    (r) => r._id === favouriteID
  );
  if (favouriteIndex > 0) {
    const [favourite] = visibleRestaurants.splice(favouriteIndex, 1);
    visibleRestaurants.unshift(favourite); // favourite first, only if its in the filtered list
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
  loginError.hidden = true;
  registerError.hidden = true;
  registerPrompt.hidden = false;
  loginButton.textContent = state.user ? state.user.username : t('login');
}
loginButton.addEventListener('click', () => {
  if (state.user) {
    profileDialog.showModal();
  } else {
    // always open in login mode, register click changes all of these
    loginForm.hidden = false;
    registerForm.hidden = true;
    registerPrompt.hidden = false;
    loginTitle.textContent = t('login');
    loginDialog.showModal();
  }
});
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // no page reload
  loginError.hidden = true; // hide old error
  const credentials = Object.fromEntries(new FormData(loginForm)); // uses the input names as keys
  try {
    const result = await loginUser(credentials);
    localStorage.setItem('token', result.token);
    state.user = result.data; // user is in data, not user
    updateLoginStatus();
    loginForm.reset();
    loginDialog.close();
  } catch (error) {
    console.error('Login failed:', error);
    loginError.textContent = t('wrongCredentials'); // dont tell which one was wrong
    loginError.hidden = false;
  }
});
showRegisterButton.addEventListener('click', () => {
  loginForm.hidden = true;
  registerForm.hidden = false;
  registerPrompt.hidden = true;
  loginTitle.textContent = t('register'); // change the title to register
});
registerUsername.addEventListener('blur', async () => {
  const username = registerUsername.value.trim();
  if (!username) return;
  try {
    const available = await checkUserNameAvailability(username);
    usernameStatus.textContent = available
      ? t('usernameAvailable')
      : t('usernameTaken');
  } catch (error) {
    usernameStatus.textContent = '';
  }
});
registerForm.addEventListener('submit', async (event) => {
  registerError.hidden = true; // hide old error
  event.preventDefault();
  const user = Object.fromEntries(new FormData(registerForm));
  try {
    const result = await registerUser(user);
    const loginResult = await loginUser({
      username: user.username,
      password: user.password,
    }); // log in straight away, no need to type it again
    localStorage.setItem('token', loginResult.token);
    state.user = loginResult.data; // user is in data, not user
    updateLoginStatus();
    loginDialog.close();
    registerForm.reset();
    registerForm.hidden = true;
    loginForm.hidden = false;
    registerPrompt.hidden = false;
  } catch (error) {
    console.error('Registration failed:', error);
    if (error.message.includes('535')) {
      // 535 = server email fails but the user IS created
      registerError.textContent = t('registrationEmailError');
    } else if (error.status >= 500) {
      registerError.textContent = t('serverError');
    } else {
      registerError.textContent = t('registrationFailed');
    }
    registerError.hidden = false;
  }
});

function logoutUser() {
  localStorage.removeItem('token');
  state.user = null;
  updateLoginStatus();
  profileDialog.close();
}
logoutButton.addEventListener('click', logoutUser);

async function restoreLogin() {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    state.user = await fetchUserProfile(token);
    updateLoginStatus();
  } catch (error) {
    console.error('Failed to restore login:', error);
    localStorage.removeItem('token'); // expired or broken token
  }
}

function updateFavouriteButton() {
  favouriteButton.hidden = !state.user; // no button when logged out
  if (!state.user) {
    favouriteButton.disabled = true;
    return;
  }
  const isFavourite = state.user.favouriteRestaurant === state.currentID;
  favouriteButton.textContent = isFavourite
    ? t('favourite')
    : t('addFavourite');
  favouriteButton.disabled = isFavourite; // can't remove a favourite, api gives 400 for null
}

favouriteButton.addEventListener('click', async () => {
  try {
    const newFavouriteRestaurant =
      state.user.favouriteRestaurant === state.currentID
        ? null
        : state.currentID;
    await updateUserProfile(localStorage.getItem('token'), {
      favouriteRestaurant:
        state.user.favouriteRestaurant === state.currentID
          ? null
          : state.currentID,
    });
    state.user.favouriteRestaurant = newFavouriteRestaurant;
    applyFilters(); // so the favourite moves to the top
  } catch (error) {
    console.error('Failed to update favourite restaurant:', error);
  }
  updateFavouriteButton();
});

// Language switch
// applyLanguage only does the html, texts made in js have to be redrawn here
function changeLanguage(lang) {
  state.lang = lang; // for the menu fetch
  setLanguage(lang); // for t()
  localStorage.setItem('lang', lang); // same as theme
  applyLanguage();
  updateLoginStatus();
  if (state.currentID) {
    updateFavouriteButton();
    loadMenu(); // api gives the menu in the new lang
  }
}

// change bubbles up from the radios
document
  .getElementById('language-fieldset')
  .addEventListener('change', (event) => changeLanguage(event.target.value));

// Initial load

// saved -> browser lang -> fi
const startLang =
  localStorage.getItem('lang') ||
  (navigator.language.startsWith('fi') ? 'fi' : 'en');
document.querySelector(`input[name="language"][value="${startLang}"]`).checked =
  true;
changeLanguage(startLang);

await restoreLogin();
await loadRestaurants();
