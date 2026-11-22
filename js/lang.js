// all ui texts fi + en, keys named by meaning not by the wording
// add every key to both or the page shows undefined
export const texts = {
  fi: {
    // page + header
    pageTitle: 'Opiskelijaravintolat',
    appTitle: 'Opiskelijaravintolat',
    settings: 'Asetukset',
    login: 'Kirjaudu',
    lightMode: 'Vaalea tila',

    // filters + list
    filters: 'Suodattimet',
    sortLabel: 'Järjestys:',
    sortName: 'Nimi (A–Ö)',
    sortNearest: 'Lähin ensin',
    cityLabel: 'Kaupunki:',
    allCities: 'Kaikki kaupungit',
    companyLabel: 'Yritys:',
    allCompanies: 'Kaikki yritykset',
    restaurants: 'Ravintolat',
    nearest: 'Lähin',
    gettingLocation: 'Haetaan sijaintia..',
    locationError: 'Sijaintia ei saatu.',

    // footer
    dataCredit: 'Ravintolatiedot: Metropolian opiskelijaravintola-API',

    // settings dialog
    language: 'Kieli',
    close: 'Sulje',

    // login + register
    username: 'Käyttäjätunnus',
    password: 'Salasana',
    logIn: 'Kirjaudu sisään',
    noAccount: 'Eikö sinulla ole tiliä?',
    register: 'Rekisteröidy',
    email: 'Sähköposti',
    createAccount: 'Luo tili',
    usernameAvailable: 'Käyttäjätunnus on vapaana',
    usernameTaken: 'Käyttäjätunnus on varattu',
    wrongCredentials: 'Väärä käyttäjätunnus tai salasana.',
    serverError: 'Palvelinvirhe. Yritä myöhemmin uudelleen.',
    registrationFailed: 'Rekisteröinti epäonnistui. Yritä uudelleen.',
    registrationEmailError:
      'Tili luotiin, mutta palvelimen sähköpostissa oli virhe. Kirjaudu sisään.',

    // profile dialog
    profile: 'Profiili',
    profileAvatar: 'Profiilikuva',
    changeAvatar: 'Vaihda profiilikuva:',
    upload: 'Lähetä',
    changeUsername: 'Vaihda käyttäjätunnus',
    changeEmail: 'Vaihda sähköposti',
    newPassword: 'Uusi salasana',
    updateProfile: 'Päivitä profiili',
    logout: 'Kirjaudu ulos',

    // restaurant dialog + menu
    addFavourite: 'Lisää suosikiksi',
    favourite: '★ Suosikki',
    menu: 'Ruokalista',
    today: 'Tänään',
    weekly: 'Viikko',
    loadingMenu: 'Ladataan ruokalistaa…',
    menuError: 'Ruokalistan lataus epäonnistui.',
    noMenuToday: 'Tälle päivälle ei ole ruokalistaa.',
    noMenuWeek: 'Ruokalistaa ei ole saatavilla.',
    price: 'Hinta',
    notAvailable: 'Ei saatavilla',
    diets: 'Ruokavaliot',
    dietsNone: 'Ei merkintöjä',

    // error dialog
    errorTitle: 'Yhteysongelma',
    errorMessage: 'Ravintoloita ei voitu ladata.',
    tryAgain: 'Yritä uudelleen',
  },
  en: {
    // page + header
    pageTitle: 'Student Restaurant App',
    appTitle: 'Student restaurant app',
    settings: 'Settings',
    login: 'Login',
    lightMode: 'Light mode',

    // filters + list
    filters: 'Filters',
    sortLabel: 'Sort:',
    sortName: 'Name (A–Z)',
    sortNearest: 'Nearest',
    cityLabel: 'City:',
    allCities: 'All cities',
    companyLabel: 'Company:',
    allCompanies: 'All companies',
    restaurants: 'Restaurants',
    nearest: 'Nearest',
    gettingLocation: 'Getting your location…',
    locationError: 'Could not get your location.',

    // footer
    dataCredit: 'Restaurant data: Metropolia Student Restaurants API',

    // settings dialog
    language: 'Language',
    close: 'Close',

    // login + register
    username: 'Username',
    password: 'Password',
    logIn: 'Log in',
    noAccount: 'No account?',
    register: 'Register',
    email: 'Email',
    createAccount: 'Create account',
    usernameAvailable: 'Username is available',
    usernameTaken: 'Username is taken',
    wrongCredentials: 'Wrong username or password.',
    serverError: 'Server error. Please try again later.',
    registrationFailed: 'Registration failed. Please try again.',
    registrationEmailError:
      'Account created, but the server had an email error. Please log in.',

    // profile dialog
    profile: 'Profile',
    profileAvatar: 'Profile avatar',
    changeAvatar: 'Change avatar:',
    upload: 'Upload',
    changeUsername: 'Change username',
    changeEmail: 'Change email',
    newPassword: 'New password',
    updateProfile: 'Update profile',
    logout: 'Logout',

    // restaurant dialog + menu
    addFavourite: 'Add as favourite',
    favourite: '★ Favourite',
    menu: 'Menu',
    today: 'Today',
    weekly: 'Weekly',
    loadingMenu: 'Loading menu…',
    menuError: 'Error loading menu.',
    noMenuToday: 'No menu available for today.',
    noMenuWeek: 'No menu available.',
    price: 'Price',
    notAvailable: 'Not available',
    diets: 'Dietary info',
    dietsNone: 'None',

    // error dialog
    errorTitle: 'API connection problem',
    errorMessage: 'Restaurants could not be loaded.',
    tryAgain: 'Try again',
  },
};

let currentLang = 'fi';

export function setLanguage(lang) {
  currentLang = lang;
}
export function t(key) {
  return texts[currentLang][key];
}

// the html texts, everything with data-lang
export function applyLanguage() {
  document.documentElement.lang = currentLang;
  document.title = t('pageTitle');

  // data-lang only on elements with just text, textContent wipes the children (radio inside label) -> span
  for (const element of document.querySelectorAll('[data-lang]')) {
    element.textContent = t(element.dataset.lang);
  }

  // alt is an attribute, textContent doesnt reach it
  document.getElementById('profile-avatar').alt = t('profileAvatar');
}
