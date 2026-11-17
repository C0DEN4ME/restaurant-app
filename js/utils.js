export function distanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers

  const toRad = (deg) => (deg * Math.PI) / 180; // Convert degrees to radians

  const dLat = toRad(lat2 - lat1); 
  const dLon = toRad(lon2 - lon1);
  
  // Haversine formula
  const a = 
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in kilometers
}

export function getUserPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}
