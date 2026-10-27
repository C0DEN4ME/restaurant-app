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
