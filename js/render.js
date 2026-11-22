import {t} from './lang.js';

function normalizeDietaryInfo(dietaryInfo) {
  if (!dietaryInfo) return [];
  if (Array.isArray(dietaryInfo)) return dietaryInfo;
  return dietaryInfo.split(',').map((item) => item.trim());
}

function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function renderRestaurantslist(restaurants) {
  const list = document.getElementById('restaurant-list');
  list.replaceChildren();
  for (const restaurant of restaurants) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.id = restaurant._id;
    btn.textContent = restaurant.name;

    if (restaurant.distance !== undefined) {
      const distanceInfo = document.createElement('span');
      distanceInfo.textContent = `(${restaurant.distance.toFixed(1)} km)`;
      btn.appendChild(distanceInfo);
    }
    li.appendChild(btn);
    list.appendChild(li);
  }
}

export function renderDailyMenu(courses, container) {
  container.replaceChildren();
  if (!courses || courses.length === 0) {
    const noMenuMessage = document.createElement('p');
    noMenuMessage.textContent = t('noMenuToday');
    container.appendChild(noMenuMessage);
    return;
  }
  // same as weekly, renderCourses does the courses
  renderCourses(courses, container);
}

export function renderWeeklyMenu(days, container) {
  container.replaceChildren();
  if (!days || days.length === 0) {
    const noMenuMessage = document.createElement('p');
    noMenuMessage.textContent = t('noMenuWeek');
    container.appendChild(noMenuMessage);
    return;
  }
  for (const day of days) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const heading = document.createElement('h3');
    heading.textContent = capitalizeFirstLetter(day.date);
    summary.appendChild(heading);
    details.appendChild(summary);
    container.appendChild(details);
    renderCourses(day.courses, details);
  }
}

function renderCourses(courses, container) {
  for (const course of courses) {
    const courseDiv = document.createElement('div');
    courseDiv.classList.add('course');
    const name = document.createElement('h4');
    name.textContent = course.name;
    const price = document.createElement('p');
    // colon outside the key
    if (course.price === undefined || course.price === null) {
      price.textContent = `${t('price')}: ${t('notAvailable')}`;
    } else {
      price.textContent = `${t('price')}: ${course.price}`;
    }
    const dietaryInfo = document.createElement('p');
    const dietaryArray = normalizeDietaryInfo(course.diets);
    if (dietaryArray.length > 0) {
      dietaryInfo.textContent = `${t('diets')}: ${dietaryArray.join(', ')}`;
    } else {
      dietaryInfo.textContent = `${t('diets')}: ${t('dietsNone')}`;
    }
    courseDiv.appendChild(name);
    courseDiv.appendChild(price);
    courseDiv.appendChild(dietaryInfo);
    container.appendChild(courseDiv);
  }
}

export function renderCities(restaurants) {
  const cityfilter = document.getElementById('city-filter');
  const cities = [...new Set(restaurants.map((r) => r.city))].sort();
  for (const city of cities) {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    cityfilter.appendChild(option);
  }
}
