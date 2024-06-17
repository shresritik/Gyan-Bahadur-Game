const grapes = "./src/assets/grapes.png";
const banana = "./src/assets/banana.png";
const corona = "./src/assets/corona.png";
const singleFire = "./src/assets/single-fire.png";
const wall = "./src/assets/wall.png";
let grapesBool = false;
let bananaBool = false;
let coronaBool = false;
let singleFireBool = false;
let wallBool = false;

function grapesFunc() {
  grapesBool = true;
  bananaBool = false;
  coronaBool = false;
  singleFireBool = false;
  wallBool = false;
}

function bananaFunc() {
  bananaBool = true;
  grapesBool = false;
  coronaBool = false;
  singleFireBool = false;
  wallBool = false;
}

function coronaFunc() {
  coronaBool = true;
  bananaBool = false;
  grapesBool = false;
  singleFireBool = false;
  wallBool = false;
}

function fireFunc() {
  singleFireBool = true;
  coronaBool = false;
  grapesBool = false;
  wallBool = false;
  bananaBool = false;
}
function wallFunc() {
  singleFireBool = true;
  coronaBool = false;
  grapesBool = false;
  wallBool = true;
  bananaBool = false;
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

function createMapObj(rows: number, cols: number) {
  let map = Array.from({ length: rows }, () => Array(cols).fill(0));

  // for (let point of specialPoints) {
  //   let [row, col, value] = point;
  //   map[row][col] = value;
  // }

  return { map: map };
}

const rows = 20;
const cols = 120;

let mapObj = createMapObj(rows, cols);
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
        if (mapObj.map[row][column] === 1) image.src = wall;
        if (mapObj.map[row][column] === 2) image.src = grapes;
        if (mapObj.map[row][column] === 3) image.src = banana;
        if (mapObj.map[row][column] === 4) image.src = corona;
        if (mapObj.map[row][column] === 5) image.src = singleFire;
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

  if (wallBool) {
    image.src = wall;
    value = 1;
  } else if (grapesBool) {
    image.src = grapes;
    value = 2;
  } else if (bananaBool) {
    image.src = banana;
    value = 3;
  } else if (coronaBool) {
    image.src = corona;
    value = 4;
  } else if (singleFireBool) {
    image.src = singleFire;
    value = 5;
  } else {
    value = 0;
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
