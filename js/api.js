/* All fetch, get, post, put, delete requests are handled here.*/

import {API_URL} from './config.js';
export async function fetchRestaurants() {
  try {
    const response = await fetch(API_URL + '/restaurants');
    if (!response.ok) {
      throw new Error(`Failed to fetch restaurants Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
}
export async function fetchRestaurantMenu(id, type, lang) {
  try {
    const response = await fetch(
      `${API_URL}/restaurants/${type}/${id}/${lang}`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch restaurant menu. Error: ${response.status}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    throw error;
  }
  // TEMP TEST: delete when done
}
