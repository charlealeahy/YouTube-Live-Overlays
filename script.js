
async function updateOverlay() {
  try {
    const iss = await fetch("https://api.wheretheiss.at/v1/satellites/25544").then(r => r.json());
    const lat = iss.latitude.toFixed(2);
    const lon = iss.longitude.toFixed(2);
    const speed = iss.velocity.toFixed(2);
    const altitude = iss.altitude.toFixed(1);

    document.getElementById("coords").innerText = `Lat: ${lat}°, Lon: ${lon}°`;
    document.getElementById("speed-alt").innerText = `Speed: ${speed} km/s | Alt: ${altitude} km`;

    const geo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`).then(r => r.json());
    const region = geo.city || geo.locality || geo.principalSubdivision || "Ocean";
    const country = geo.countryName || "Unknown";
    const iso = geo.countryCode || "UN";

    document.getElementById("location").innerText = `${region}, ${country}`;
    document.getElementById("flag").innerHTML = `<img src="https://flagcdn.com/48x36/${iso.toLowerCase()}.png">`;

    const sun = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`).then(r => r.json());
    const sunsetUTC = new Date(sun.results.sunset).toUTCString().split(" ")[4];
    document.getElementById("sunset").innerText = `Sunset at: ${sunsetUTC} UTC`;

    const now = new Date();
    document.getElementById("datetime").innerText = `UTC: ${now.toISOString().slice(11,19)}`;

    // Example OWID-style data (could be extended with real source)
    const owidData = {
      "South Sudan": { population: "11.2M", energy: "78% biomass" },
      "United States": { population: "331M", energy: "62% fossil" },
      "Ocean": { population: "N/A", energy: "N/A" }
    };

    const data = owidData[country] || { population: "Unknown", energy: "Unknown" };
    document.getElementById("country-data").innerText = `Population: ${data.population} | Energy: ${data.energy}`;

  } catch (e) {
    console.error("Overlay error:", e);
    document.getElementById("status").innerText = "OFFLINE";
    document.getElementById("status").style.backgroundColor = "blue";
  }
}

updateOverlay();
setInterval(updateOverlay, 10000);
