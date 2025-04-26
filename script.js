document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.sunrisesunset.io/json";
  const select = document.getElementById("locations");
  const useLocBtn = document.getElementById("use-location");
  const dashboard = document.getElementById("dashboard");

  const locations = [
    { name: "Chicago", lat: 41.8781, lng: -87.6298 },
    { name: "New York", lat: 40.7128, lng: -74.0060 },
    { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "Tokyo", lat: 35.6895, lng: 139.6917 },
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "Sydney", lat: -33.8688, lng: 151.2093 },
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Berlin", lat: 52.5200, lng: 13.4050 },
    { name: "Toronto", lat: 43.6510, lng: -79.3470 },
  ];

  // Populate dropdown
  locations.forEach(({ name, lat, lng }) => {
    select.innerHTML += `<option value="${lat},${lng}">${name}</option>`;
  });

  select.addEventListener("change", () => {
    const [lat, lng] = select.value.split(",");
    fetchSunData(lat, lng);
  });

  useLocBtn.addEventListener("click", () => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => fetchSunData(coords.latitude, coords.longitude),
      () => showError("Unable to retrieve your location.")
    ) || showError("Geolocation is not supported by your browser.");
  });

  async function fetchSunData(lat, lng) {
    dashboard.innerHTML = `<div class="loader">Loading...</div>`;
    try {
      const [todayData, tomorrowData] = await Promise.all([
        fetch(`${API_URL}?lat=${lat}&lng=${lng}&date=today`).then(r => r.json()),
        fetch(`${API_URL}?lat=${lat}&lng=${lng}&date=tomorrow`).then(r => r.json()),
      ]);
      if (todayData.status === "OK" && tomorrowData.status === "OK") {
        renderDashboard(todayData.results, tomorrowData.results);
      } else {
        showError("Error loading data.");
      }
    } catch {
      showError("API request failed. Try again later.");
    }
  }

  function renderDashboard(today, tomorrow) {
    const todayDate = new Date().toLocaleDateString();
    const tomorrowDate = new Date(Date.now() + 86400000).toLocaleDateString();

    dashboard.innerHTML = `
      <div class="day">
        <h2>Today 📅 (${todayDate})</h2>
        ${formatSunData(today)}
      </div>
      <div class="day">
        <h2>Tomorrow 📅 (${tomorrowDate})</h2>
        ${formatSunData(tomorrow)}
      </div>
    `;
  }

  function formatSunData({ sunrise, sunset, dawn, dusk, solar_noon, day_length, timezone }) {
    return `
      <p>🌅 <strong>Sunrise:</strong> ${sunrise}</p>
      <p>🌇 <strong>Sunset:</strong> ${sunset}</p>
      <p>🌄 <strong>Dawn:</strong> ${dawn}</p>
      <p>🌃 <strong>Dusk:</strong> ${dusk}</p>
      <p>🕒 <strong>Solar Noon:</strong> ${solar_noon}</p>
      <p>🕰️ <strong>Day Length:</strong> ${day_length}</p>
      <p>🌍 <strong>Time Zone:</strong> ${timezone}</p>
    `;
  }

  function showError(message) {
    dashboard.innerHTML = `<div class="error">${message}</div>`;
  }
});

const toggleGalleryBtn = document.getElementById('toggle-gallery');
const gallery = document.getElementById('gallery');

toggleGalleryBtn.addEventListener('click', () => {
    gallery.style.display = 'block'; // Show the gallery
});

// Hide the gallery when mouse leaves it
gallery.addEventListener('mouseleave', () => {
    gallery.style.display = 'none'; // Hide the gallery
});
