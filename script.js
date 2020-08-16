//Selectors
const form = document.querySelector("#form");
const weightInput = document.querySelector("#weightInput");
const heightInput = document.querySelector("#heightInput");
const dateInput = document.querySelector("#dateInput");
const retrieveButton = document.querySelector("#retrieve-button");
const signInButton = document.querySelector("#sign-in-button");
const tableDisplay = document.querySelector("#table-display");
let tableContainer = document.querySelector("#table-container");
let deleteButtons;
var ctx = document.querySelector("#myChart").getContext("2d");

const submitMeasurements = function (event) {
  const metrics = {
    date: dateInput.value,
    height: heightInput.value,
    weight: weightInput.value,
  };
  localStorage.setItem(metrics.date, metrics.weight);
  event.preventDefault();
  clearInputs();
};

function clearInputs() {
  weightInput.value = "";
  heightInput.value = "";
  dateInput.value = "";
}

function displayTable() {
  let dateHeader = document.createElement("th");
  let weightHeader = document.createElement("th");
  dateHeader.innerText = "Date";
  weightHeader.innerText = "Weight";
  tableDisplay.innerHTML = "";
  tableDisplay.appendChild(dateHeader);
  tableDisplay.appendChild(weightHeader);

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
    deleteButton.classList = `delete`;
    deleteButton.id = key;

    row.appendChild(date);
    row.appendChild(weight);
    row.appendChild(deleteButton);
    tableDisplay.appendChild(row);
    tableContainer.appendChild(tableDisplay);
  }
}

function displayChart() {
  let dataArray = [];
  let labelArray = [];
  let minKey;
  let maxKey;
  let arr = [];

  //Create datasets for chart render
  for (const [key, value] of Object.entries(localStorage)) {
    dataArray.push(value);
    labelArray.push(key);
  }

  for (const [key, value] of Object.entries(localStorage)) {
    arr.push(Number(value));
  }

  minKey = Math.min(...arr);
  maxKey = Math.max(...arr);

  //set chart axis to min and max values of dataset
  Chart.scaleService.updateScaleDefaults("linear", {
    ticks: {
      min: minKey - 10,
      max: maxKey + 10,
    },
  });

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

function deleteCheck(e) {
  let item = e.target;
  if (item.className == "delete") {
    console.log("yes");
    localStorage.removeItem(item.id);
    displayTable();
  }
}
// deleteButtons.forEach((button) =>
//   button.addEventListener("click", console.log(button))
// );

//TODO: Figure out how to sort the date keys
// function sortKeys() {
//   let ordered = {};
//   console.log(localStorage);
//   Object.keys(localStorage)
//     .sort()
//     .forEach(function (key) {
//       ordered[new Date(key)] = localStorage[new Date(key)];
//     });
//   console.log(localStorage);
// }
