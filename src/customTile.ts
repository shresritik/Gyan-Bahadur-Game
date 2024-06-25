import grapes from "./assets/images/grapes.png";
import corona from "./assets/images/corona.png";
import singleFire from "./assets/images/single-fire.png";
import wall from "./assets/images/wall.png";
import flag from "./assets/images/single-flag.png";
import animal from "./assets/images/dog1.png";
import ammo from "./assets/images/single-water.png";
import none from "./assets/images/none.png";
import jet from "./assets/images/jetpack.png";
import { isCustom, menuOptions } from "./constants/constants";
import { MapObject } from "./interface/interface";
const images = {
  grapes,
  corona,
  singleFire,
  wall,
  flag,
  animal,
  ammo,
  none,
  jet,
};

// Define a type for the keys of the images object
type ImageKey = keyof typeof images;

let selectedTile: ImageKey | null = null;

const rows = 20;
const cols = 120;
let mapObj: MapObject = createMapObj(rows, cols);

// Create table element and append to document body
const customLevel = document.createElement("div");
customLevel.className = "customLevel";
const tableEl = document.createElement("table");
customLevel.append(tableEl);

let visibleStartIndex = 0;
let isMouseDown = false;

/**
 * initialize the map with zeros
 * @param rows no. of rows
 * @param cols no.of cols
 * @returns array of rows and cols
 */
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

// Function to render the table with mouse events and image on the columns
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
      tableColumn.addEventListener("mouseleave", () => {
        isMouseDown = false;
      });
      tableColumn.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (isMouseDown) addTile(row, column, tableColumn);
      });

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

// Function to add tile to the map with image and the values based on the selected tile
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
    case 9:
      return "jet";
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
    case "jet":
      return 9;
    default:
      return 0;
  }
}
// Reset map values and images to 0

function reset() {
  isCustom.custom = false;
  const tds = document.querySelectorAll("td");

  for (let row = 0; row < mapObj.map.length; row++) {
    for (let col = 0; col < mapObj.map[row].length; col++) {
      mapObj.map[row][col] = 0;
    }
  }

  tds.forEach((td) => {
    const images = td.querySelectorAll("img");
    images.forEach((img) => img.remove());
  });
}
//set the custom variable to true and remove the editor
function play() {
  isCustom.custom = true;
  customLevel.style.display = "none";
  menuOptions.option = "Play";
}
//remove the custom editor
function back() {
  isCustom.custom = false;
  customLevel.style.display = "none";
}
// Create div and button elements dynamically
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

  const backButton = document.createElement("button");
  backButton.innerText = "Back";
  backButton.onclick = back;
  buttonDiv.append(backButton);
  // Create previous button
  const prevButton = document.createElement("button");
  prevButton.innerText = "Prev";
  prevButton.onclick = prev;
  buttonDiv.appendChild(prevButton);
  // Create next button
  const nextButton = document.createElement("button");
  nextButton.innerText = "Next";
  nextButton.onclick = next;
  buttonDiv.appendChild(nextButton);

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
  // Create save button
  const saveButton = document.createElement("button");
  saveButton.innerText = "Save";
  saveButton.onclick = save;
  buttonDiv.appendChild(saveButton);

  controlsDiv.append(imgDiv, buttonDiv);
  customLevel.appendChild(controlsDiv);
}
document.body.appendChild(customLevel);

// Load saved map if exists and render table
load();
renderTable();
createUI();
