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
      const name = document.createElement('h3');
      name.textContent = course.name;
      const price = document.createElement('p');
      price.textContent = `Price: ${course.price}`;
      courseDiv.appendChild(name);
      courseDiv.appendChild(price);
      container.appendChild(courseDiv);
    }
  }
}
