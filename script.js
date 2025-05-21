const weatherbox = document.querySelector(".weatherBox");
const inputField = document.querySelector(".InputField");
const inputButton = document.querySelector(".inputButton");
const forecastContainer = document.querySelector(".forecast");

inputButton.addEventListener('click', () => getTheWeather(inputField.value));

async function getTheWeather(location) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=7K9HDGKA86ZBB55S6FZEALQBU`);
    const data = await response.json();

    const todayTemp = FtoC(data.days[0].temp).toFixed(1);
    weatherbox.textContent = `Current temp: ${todayTemp}°C`;

    forecastContainer.innerHTML = "";

    const next7Days = data.days.slice(0, 7);
    next7Days.forEach(day => {
      const dayName = new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'short' });
      const temp = FtoC(day.temp).toFixed(1);
      const description = day.conditions;

      const iconUrl = getWeatherIcon(description.toLowerCase());

      const forecastEl = document.createElement("div");
      forecastEl.classList.add("forecast-day");
      forecastEl.innerHTML = `
        <img src="${iconUrl}" alt="${description}">
        <strong>${dayName}</strong>
        <span>${temp}°C</span>
        <small>${description}</small>
      `;
      forecastContainer.appendChild(forecastEl);
    });

  } catch (error) {
    weatherbox.textContent = "Could not fetch weather data.";
    forecastContainer.innerHTML = "";
  }
}

function FtoC(temp) {
  return (temp - 32) * 5 / 9;
}

function getWeatherIcon(desc) {
  // simple keyword match - could be replaced by a real icon API if needed
  if (desc.includes("rain")) return "https://cdn-icons-png.flaticon.com/512/1163/1163624.png";
  if (desc.includes("cloud")) return "https://cdn-icons-png.flaticon.com/512/1163/1163620.png";
  if (desc.includes("sun") || desc.includes("clear")) return "https://cdn-icons-png.flaticon.com/512/869/869869.png";
  if (desc.includes("snow")) return "https://cdn-icons-png.flaticon.com/512/642/642102.png";
  if (desc.includes("storm")) return "https://cdn-icons-png.flaticon.com/512/1146/1146860.png";
  return "https://cdn-icons-png.flaticon.com/512/1163/1163630.png"; // fallback: partly cloudy
}
