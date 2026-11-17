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
    li.appendChild(btn);
    list.appendChild(li);
  }
}

export function renderDailyMenu(courses, container) {
  container.replaceChildren();
  if (!courses || courses.length === 0) {
    const noMenuMessage = document.createElement('p');
    noMenuMessage.textContent = 'No menu available for today.';
    container.appendChild(noMenuMessage);
    return;
  } else {
    for (const course of courses) {
      const courseDiv = document.createElement('div');
      courseDiv.classList.add('course');
      const name = document.createElement('h4');
      name.textContent = course.name;
      const price = document.createElement('p');
      if (course.price === undefined || course.price === null) {
        price.textContent = 'Price: Not available';
      } else {
        price.textContent = `Price: ${course.price}`;
      }
      const dietaryInfo = document.createElement('p');
      const dietaryArray = normalizeDietaryInfo(course.diets);
      if (dietaryArray.length > 0) {
        dietaryInfo.textContent = `Dietary Info: ${dietaryArray.join(', ')}`;
      } else {
        dietaryInfo.textContent = 'Dietary Info: None';
      }
      courseDiv.appendChild(name);
      courseDiv.appendChild(price);
      courseDiv.appendChild(dietaryInfo);
      container.appendChild(courseDiv);
    }
  }
}

export function renderWeeklyMenu(days, container) {
  container.replaceChildren();
  if (!days || days.length === 0) {
    const noMenuMessage = document.createElement('p');
    noMenuMessage.textContent = 'No menu available.';
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
    if (course.price === undefined || course.price === null) {
      price.textContent = 'Price: Not available';
    } else {
      price.textContent = `Price: ${course.price}`;
    }
    const dietaryInfo = document.createElement('p');
    const dietaryArray = normalizeDietaryInfo(course.diets);
    if (dietaryArray.length > 0) {
      dietaryInfo.textContent = `Dietary Info: ${dietaryArray.join(', ')}`;
    } else {
      dietaryInfo.textContent = 'Dietary Info: None';
    }
    courseDiv.appendChild(name);
    courseDiv.appendChild(price);
    courseDiv.appendChild(dietaryInfo);
    container.appendChild(courseDiv);
  }
}
