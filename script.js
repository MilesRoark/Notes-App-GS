const notesContainer = document.querySelector(".notes-container");
const createBtn = document.querySelector(".btn");
let notes = document.querySelectorAll(".input-box");
const currentTimeElement = document.getElementById("current-time");
const weatherInfoElement = document.getElementById("weather-info");

weatherInfoElement.textContent = "Loading weather...";

function updateCurrentTime() {
  const now = new Date();
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  currentTimeElement.textContent = now.toLocaleTimeString([], options);
}

updateCurrentTime();
setInterval(updateCurrentTime, 60000);

async function getWeatherData() {
  try {
    const locationTimeout = setTimeout(() => {
      getFallbackWeather("New York");
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(locationTimeout);
        const { latitude, longitude } = position.coords;
        await fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        clearTimeout(locationTimeout);
        console.error("Geolocation error:", error);
        getFallbackWeather("New York");
      },
      { timeout: 8000 }
    );
  } catch (error) {
    weatherInfoElement.textContent = "Weather data unavailable";
    console.error("Weather API error:", error);
    getFallbackWeather("New York");
  }
}

async function fetchWeatherByCoords(latitude, longitude) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=9fd7a449d055dba26a982a3220f32aa2`
    );

    if (!response.ok) {
      throw new Error("Weather data not available");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherInfoElement.textContent = "Weather data unavailable";
    console.error("Weather API error:", error);
  }
}

async function getFallbackWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=9fd7a449d055dba26a982a3220f32aa2`
    );

    if (!response.ok) {
      throw new Error("Fallback weather data not available");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherInfoElement.textContent = "Weather data unavailable";
    console.error("Fallback weather error:", error);
  }
}

function displayWeather(data) {
  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
  const location = data.name;

  weatherInfoElement.innerHTML = `
    ${location}: ${description}, ${temp}°C
    <img src="${iconUrl}" alt="${description}">
  `;
}

getWeatherData();
setInterval(getWeatherData, 30 * 60 * 1000);

function showNotes() {
  notesContainer.innerHTML = localStorage.getItem("notes");

  notes = document.querySelectorAll(".input-box");
  notes.forEach((nt) => {
    nt.onkeyup = function () {
      updateStorage();
    };
  });
}
showNotes();

function initializeNoteStates() {
  const allNotes = document.querySelectorAll(".input-box");
  if (allNotes.length > 1) {
    allNotes.forEach((note, index) => {
      if (index > 0) {
        note.classList.add("shrunk");
      }
    });
    updateStorage();
  }
}

setTimeout(initializeNoteStates, 100);

function updateStorage() {
  localStorage.setItem("notes", notesContainer.innerHTML);
}

// Function to get formatted date and time
function getFormattedDateTime() {
  const now = new Date();
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return now.toLocaleString([], options);
}

createBtn.addEventListener("click", () => {
  const existingNotes = document.querySelectorAll(".input-box");
  existingNotes.forEach((note) => {
    note.classList.add("shrunk");
  });

  let inputBox = document.createElement("p");
  let img = document.createElement("img");
  let timestamp = document.createElement("div");

  inputBox.className = "input-box";
  inputBox.setAttribute("contenteditable", "true");

  // Create and add timestamp
  timestamp.className = "note-timestamp";
  timestamp.textContent = getFormattedDateTime();
  timestamp.setAttribute("contenteditable", "false");

  img.src = "Assets/delete.png";

  inputBox.appendChild(img);
  inputBox.appendChild(timestamp);
  notesContainer.appendChild(inputBox);

  inputBox.focus();

  updateStorage();
});

notesContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    e.target.parentElement.remove();
    updateStorage();
  } else if (e.target.tagName === "P") {
    const clickedNote = e.target;

    const allNotes = document.querySelectorAll(".input-box");
    allNotes.forEach((note) => {
      note.classList.add("shrunk");
    });

    clickedNote.classList.remove("shrunk");
    updateStorage();

    notes = document.querySelectorAll(".input-box");
    notes.forEach((nt) => {
      nt.onkeyup = function () {
        updateStorage();
      };
    });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const br = document.createElement("br");

    range.deleteContents();
    range.insertNode(br);

    range.setStartAfter(br);
    range.setEndAfter(br);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
