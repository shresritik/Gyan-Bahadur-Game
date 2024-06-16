let yellow = false;
let pacman = false;
let wall = false;
let ghost = false;

function pacmanFunc() {
  pacman = true;
  yellow = false;
  wall = false;
  ghost = false;
}

function yellowFunc() {
  yellow = true;
  pacman = false;
  wall = false;
  ghost = false;
}

function wallFunc() {
  wall = true;
  yellow = false;
  pacman = false;
  ghost = false;
}

function ghostFunc() {
  ghost = true;
  yellow = false;
  pacman = false;
  wall = false;
}

function save() {
  const saveMap = JSON.stringify(mapObj.map);
  localStorage.setItem("map", saveMap);
}

function load() {
  const savedMap = localStorage.getItem("map");
  if (savedMap) {
    mapObj.map = JSON.parse(savedMap);
    renderTable();
  }
}

function createMapObj(rows: number, cols: number, specialPoints: number[][]) {
  let map = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let point of specialPoints) {
    let [row, col, value] = point;
    map[row][col] = value;
  }

  return { map: map };
}

const rows = 20;
const cols = 120;

const specialPoints = [
  [0, 7, 1],
  [10, 14, 2],
];

let mapObj = createMapObj(rows, cols, specialPoints);
const tableEl = document.createElement("table");
document.body.append(tableEl);

let visibleStartIndex = 0; // Start by showing the first 20 columns

function next() {
  if (visibleStartIndex + 40 < cols) {
    visibleStartIndex += 5;
    renderTable();
  }
}

function prev() {
  if (visibleStartIndex > 0) {
    visibleStartIndex -= 5;
    renderTable();
  }
}

function renderTable() {
  tableEl.innerHTML = ""; // Clear existing table

  for (let row = 0; row < mapObj.map.length; row++) {
    let tableRow = document.createElement("tr");

    for (
      let column = visibleStartIndex;
      column < visibleStartIndex + 40;
      column++
    ) {
      let tableColumn = document.createElement("td");
      tableColumn.className = "cell " + row + " " + column;

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

      // Add image if the map value is not zero
      if (mapObj.map[row][column] !== 0) {
        let image = new Image();
        if (mapObj.map[row][column] === 1) image.src = "./images/wall.png";
        if (mapObj.map[row][column] === 2) image.src = "./images/pacman.png";
        if (mapObj.map[row][column] === 3) image.src = "./images/ghost.png";
        tableColumn.appendChild(image);
      }

      tableRow.appendChild(tableColumn);
    }
    tableEl.appendChild(tableRow);
  }
}

let isMouseDown = false;

function addTile(row: number, column: number, tableColumn: HTMLElement) {
  let image = new Image();
  let value: number;

  if (pacman) {
    image.src = "./images/pacman.png";
    value = 2;
  } else if (yellow) {
    image.src = "./images/yellowDot.png";
    value = 0;
  } else if (wall) {
    image.src = "./images/wall.png";
    value = 1;
  } else if (ghost) {
    image.src = "./images/ghost.png";
    value = 3;
  } else {
    value = -1;
  }

  mapObj.map[row][column] = value;
  if (image.src !== "" && !tableColumn.firstChild) {
    tableColumn.appendChild(image);
  } else if (image.src !== "" && tableColumn.firstChild) {
    (tableColumn.firstChild as HTMLImageElement).src = image.src;
  }
}

load(); // Load saved map if exists
renderTable(); // Initial render
