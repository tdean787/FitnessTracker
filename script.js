//Selectors
const form = document.querySelector("#form");
const weightInput = document.querySelector("#weightInput");
const heightInput = document.querySelector("#heightInput");
const dateInput = document.querySelector("#dateInput");
const retrieveButton = document.querySelector("#retrieve-button");
const signInButton = document.querySelector("#sign-in-button");
const tableDisplay = document.querySelector("#table-display");
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

retrieveButton.addEventListener("click", loop);
retrieveButton.addEventListener("click", displayChart);

form.addEventListener("submit", submitMeasurements);

function clearInputs() {
  weightInput.value = "";
  heightInput.value = "";
  dateInput.value = "";
}

function loop() {
  let dateHeader = document.createElement("th");
  let weightHeader = document.createElement("th");
  dateHeader.innerText = "Date";
  weightHeader.innerText = "Weight";
  tableDisplay.innerHTML = "";
  tableDisplay.appendChild(dateHeader);
  tableDisplay.appendChild(weightHeader);

  for (const [key, value] of Object.entries(localStorage)) {
    let row = document.createElement("tr");
    let date = document.createElement("td");
    let weight = document.createElement("td");
    date.innerText = key;
    weight.innerText = parseFloat(value);
    row.appendChild(date);
    row.appendChild(weight);
    tableDisplay.appendChild(row);
    form.appendChild(tableDisplay);
  }
}

function displayChart() {
  let dataArray = [];
  let labelArray = [];
  for (const [key, value] of Object.entries(localStorage)) {
    dataArray.push(value);
    labelArray.push(key);
  }

  let minKey;
  let maxKey =
    localStorage[
      Object.keys(localStorage)[Object.keys(localStorage).length - 1]
    ];
  for (const [key, value] of Object.entries(localStorage)) {
    minKey = value;
    break;
  }

  Chart.scaleService.updateScaleDefaults("linear", {
    ticks: {
      min: minKey - 10,
      max: maxKey,
    },
  });

  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labelArray,
      datasets: [
        {
          data: dataArray,
        },
      ],
    },
  });
}

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
