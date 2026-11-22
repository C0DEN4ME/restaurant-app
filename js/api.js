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
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  const result = await response.json();
  if (!response.ok || !result.token) {
    const error = new Error(
      `Login failed: ${result.message || 'Unknown error'}`
    );
    error.status = response.status;
    throw error;
  }
  return result;
}

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  const result = await response.json();
  if (!response.ok) {
    const error = new Error(
      `Login failed: ${result.message || 'Unknown error'}`
    );
    error.status = response.status;
    throw error;
  }
  return result;
}

export async function fetchUserProfile(token) {
  const response = await fetch(`${API_URL}/users/token`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      `Fetching user profile failed: ${result.message || 'Unknown error'}`
    );
  }
  return result
}

export async function checkUserNameAvailability(username) {
  const response = await fetch(
    `${API_URL}/users/available/${encodeURIComponent(username)}`,
    {
      method: 'GET',
    }
  );
  const result = await response.json();
  if (!response.ok)
    throw new Error(
      `Username availability check failed: ${result.message || 'Unknown error'}`
    );
  return result.available;
}
