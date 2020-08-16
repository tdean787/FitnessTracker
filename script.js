//Selectors
const form = document.querySelector("#form");
const weightInput = document.querySelector("#weightInput");
const heightInput = document.querySelector("#heightInput");
const dateInput = document.querySelector("#dateInput");
const retrieveButton = document.querySelector("#retrieve-button");
const signInButton = document.querySelector("#sign-in-button");
const lineChartButton = document.querySelector("line-chart");
const tableDisplay = document.querySelector("#table-display");
const tableContainer = document.querySelector("#table-container");

//Initailize variables for chart data and modifications
let deleteButtons;
let minKey;
let maxKey;
let dataArray = [];
let labelArray = [];
let orderedDates = {};
var ctx = document.querySelector("#myChart");

function submitMeasurements(event) {
  const metrics = {
    date: dateInput.value,
    height: heightInput.value,
    weight: weightInput.value,
  };
  localStorage.setItem(metrics.date, metrics.weight);
  event.preventDefault();
  clearInputs();
}

function clearInputs() {
  weightInput.value = "";
  heightInput.value = "";
  dateInput.value = "";
}

function deleteCheck(e) {
  sortStorage();
  let item = e.target;
  if (item.className == "delete btn-danger") {
    console.log("yes");
    localStorage.removeItem(item.id);
    delete orderedDates[item.id];
    displayTable();
    displayChart();
  }
}

function sortStorage() {
  Object.keys(localStorage)
    .sort(function (a, b) {
      return a
        .split("/")
        .reverse()
        .join("")
        .localeCompare(b.split("/").reverse().join(""));
    })
    .forEach(function (key) {
      orderedDates[key] = localStorage[key];
    });
  return { orderedDates };
}

function displayTable() {
  let dateHeader = document.createElement("th");
  let weightHeader = document.createElement("th");
  let deletetHeader = document.createElement("th");
  dateHeader.innerText = "Date";
  weightHeader.innerText = "Weight";
  deletetHeader.innerText = "Delete?";
  tableDisplay.innerHTML = "";
  tableDisplay.appendChild(dateHeader);
  tableDisplay.appendChild(weightHeader);
  tableDisplay.appendChild(deletetHeader);

  //create table
  for (const [key, value] of Object.entries(localStorage)) {
    //create table row elements
    let row = document.createElement("tr");
    let date = document.createElement("td");
    let weight = document.createElement("td");
    let deleteButton = document.createElement("button");

    //set table row values
    date.innerText = key;
    weight.innerText = parseFloat(value);
    deleteButton.innerText = "X";
    deleteButton.classList = `delete btn-danger`;
    deleteButton.id = key;

    row.appendChild(date);
    row.appendChild(weight);
    row.appendChild(deleteButton);
    tableDisplay.appendChild(row);
    tableContainer.appendChild(tableDisplay);
  }
}

function createChartData() {
  sortStorage();
  let arr = [];
  //Reset Charts data arrays to handle repeated clicks in same chart display session
  dataArray = [];
  labelArray = [];
  for (const [key, value] of Object.entries(orderedDates)) {
    dataArray.push(value);
    labelArray.push(key);
  }

  for (const [key, value] of Object.entries(orderedDates)) {
    arr.push(Number(value));
  }

  //Create datasets for chart render
  minKey = Math.min(...arr);
  maxKey = Math.max(...arr);
  return { dataArray, labelArray, minKey, maxKey };
}

function displayChart() {
  //set chart axis to min and max values of dataset
  createChartData();
  Chart.scaleService.updateScaleDefaults("linear", {
    ticks: {
      min: minKey - 10,
      max: maxKey + 10,
    },
  });

  //Build Charts JS object
  var myChart = new Chart(ctx, {
    type: "bar",
    options: {
      legend: {
        display: false,
      },
    },
    data: {
      labels: labelArray,
      datasets: [
        {
          data: dataArray,
          backgroundColor: "lightblue",
        },
      ],
    },
  });
}

//Listeners
retrieveButton.addEventListener("click", displayTable);
retrieveButton.addEventListener("click", displayChart);
tableContainer.addEventListener("click", deleteCheck);
form.addEventListener("submit", submitMeasurements);
