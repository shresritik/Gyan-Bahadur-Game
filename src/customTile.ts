// Image imports
import grapes from "./assets/grapes.png";
import banana from "./assets/banana.png";
import corona from "./assets/corona.png";
import singleFire from "./assets/single-fire.png";
import wall from "./assets/wall.png";
import flag from "./assets/single-flag.png";
import animal from "./assets/dog1.png";
import ammo from "./assets/single-water.png";
import none from "./assets/none.png";
import { isCustom } from "./constants/constants";
const images = {
  grapes,
  banana,
  corona,
  singleFire,
  wall,
  flag,
  animal,
  ammo,
  none,
};

// Define a type for the keys of the images object
type ImageKey = keyof typeof images;

// State variables for tile selection
let selectedTile: ImageKey | null = null;

// Map object
interface MapObject {
  map: number[][];
}

const rows = 20;
const cols = 120;
let mapObj: MapObject = createMapObj(rows, cols);

// Create table element and append to document body
const customLevel = document.createElement("div");
customLevel.className = "customLevel";
const tableEl = document.createElement("table");
customLevel.append(tableEl);

let visibleStartIndex = 0; // Start by showing the first 20 columns
let isMouseDown = false;

// Function to create map object
function createMapObj(rows: number, cols: number): MapObject {
  const map = Array.from({ length: rows }, () => Array(cols).fill(0));
  return { map };
}

// Function to handle tile selection
function selectTile(tile: ImageKey) {
  selectedTile = tile;
}

// Function to save map to local storage
function save() {
  isCustom.custom = true;
  const saveMap = JSON.stringify(mapObj.map);
  localStorage.setItem("map", saveMap);
}

// Function to load map from local storage
function load() {
  const savedMap = localStorage.getItem("map");
  if (savedMap) {
    mapObj.map = JSON.parse(savedMap);
    renderTable();
  }
}

// Function to handle next button click
function next() {
  if (visibleStartIndex + 40 < cols) {
    visibleStartIndex += 5;
    renderTable();
  }
}

// Function to handle previous button click
function prev() {
  if (visibleStartIndex > 0) {
    visibleStartIndex -= 5;
    renderTable();
  }
}

// Function to render the table
function renderTable() {
  tableEl.innerHTML = ""; // Clear existing table

  for (let row = 0; row < mapObj.map.length; row++) {
    const tableRow = document.createElement("tr");

    for (
      let column = visibleStartIndex;
      column < visibleStartIndex + 40;
      column++
    ) {
      const tableColumn = document.createElement("td");
      tableColumn.className = `cell ${row} ${column}`;

      tableColumn.addEventListener("mousedown", () => {
        isMouseDown = true;
        addTile(row, column, tableColumn);
      });

      tableColumn.addEventListener("mouseup", () => {
        isMouseDown = false;
      });

      tableColumn.addEventListener("mouseover", () => {
        if (isMouseDown) addTile(row, column, tableColumn);
      });
      tableColumn.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (isMouseDown) addTile(row, column, tableColumn);
      });

      // Add image if the map value is not zero
      if (mapObj.map[row][column] !== 0) {
        const image = new Image();
        image.src = images[getTileKey(mapObj.map[row][column]) as ImageKey];
        tableColumn.appendChild(image);
      }

      tableRow.appendChild(tableColumn);
    }
    tableEl.appendChild(tableRow);
  }
}

// Function to add tile to the map
function addTile(row: number, column: number, tableColumn: HTMLElement) {
  if (!selectedTile) return;

  const image = new Image();
  image.src = images[selectedTile];

  const value = getTileValue(selectedTile);
  mapObj.map[row][column] = value;
  if (images[selectedTile].includes("none")) {
    tableColumn.innerHTML = "";
  }
  if (!tableColumn.firstChild && !images[selectedTile].includes("none")) {
    tableColumn.appendChild(image);
  } else if (tableColumn.firstChild && !images[selectedTile].includes("none")) {
    (tableColumn.firstChild as HTMLImageElement).src = image.src;
  }
}

// Function to get tile key from value
function getTileKey(value: number): ImageKey | null {
  switch (value) {
    case 1:
      return "wall";
    case 2:
      return "grapes";
    case 3:
      return "banana";
    case 4:
      return "singleFire";
    case 5:
      return "corona";
    case 6:
      return "flag";
    case 7:
      return "animal";
    case 8:
      return "ammo";
    default:
      return null;
  }
}

// Function to get tile value from key
function getTileValue(key: ImageKey): number {
  switch (key) {
    case "wall":
      return 1;
    case "grapes":
      return 2;
    case "banana":
      return 3;
    case "singleFire":
      return 4;
    case "corona":
      return 5;
    case "flag":
      return 6;
    case "animal":
      return 7;
    case "ammo":
      return 8;
    default:
      return 0;
  }
}
function reset() {
  isCustom.custom = false;
  const tds = document.querySelectorAll("td");
  tds.forEach((td) => {
    const images = td.querySelectorAll("img");
    images.forEach((img) => img.remove());
  });
}
function play() {
  isCustom.custom = true;
  customLevel.style.display = "none";
}
// Create UI elements dynamically
function createUI() {
  const controlsDiv = document.createElement("div");
  const imgDiv = document.createElement("div");
  const buttonDiv = document.createElement("div");
  imgDiv.classList.add("imageDiv");
  buttonDiv.classList.add("buttonDiv");
  // Create image buttons
  (Object.keys(images) as ImageKey[]).forEach((key) => {
    const img = document.createElement("img");
    img.src = images[key];
    img.onclick = () => selectTile(key);
    imgDiv.appendChild(img);
  });

  // Create save button
  const saveButton = document.createElement("button");
  saveButton.innerText = "Save";
  saveButton.onclick = save;
  buttonDiv.appendChild(saveButton);

  // Create next button
  const nextButton = document.createElement("button");
  nextButton.innerText = "Next";
  nextButton.onclick = next;
  buttonDiv.appendChild(nextButton);

  // Create previous button
  const prevButton = document.createElement("button");
  prevButton.innerText = "Prev";
  prevButton.onclick = prev;
  buttonDiv.appendChild(prevButton);
  // Create reset button
  const resetButton = document.createElement("button");
  resetButton.innerText = "Reset";
  resetButton.onclick = reset;
  buttonDiv.append(resetButton);
  // Create play button
  const playButton = document.createElement("button");
  playButton.innerText = "Play";
  playButton.onclick = play;
  buttonDiv.append(playButton);

  controlsDiv.append(imgDiv, buttonDiv);
  customLevel.appendChild(controlsDiv);
}
document.body.appendChild(customLevel);

// Load saved map if exists and render table
load();
renderTable();
createUI();
