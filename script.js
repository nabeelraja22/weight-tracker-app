let entries = JSON.parse(localStorage.getItem("trackerEntries") || "[]");

const dateInput = document.getElementById("date");
const weightInput = document.getElementById("weight");
const waterInput = document.getElementById("water");
const sleepInput = document.getElementById("sleep");
const stepsInput = document.getElementById("steps");
const workoutInput = document.getElementById("workout");
const mealsInput = document.getElementById("meals");
const addEntryBtn = document.getElementById("addEntry");

const entriesTable = document.querySelector("#entriesTable tbody");
const milestonesList = document.getElementById("milestones");

const ctx = document.getElementById("weightChart").getContext("2d");
let weightChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Weight (kg)",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  },
  options: { responsive: true, scales: { y: { beginAtZero: false } } },
});

function updateDisplay() {
  entriesTable.innerHTML = "";
  entries
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((e) => {
      const row = `<tr>
            <td>${e.date}</td>
            <td>${e.weight} kg</td>
            <td>${e.water} L</td>
            <td>${e.sleep} hrs</td>
            <td>${e.steps}</td>
            <td>${e.workout ? "✅" : "❌"}</td>
            <td>${e.meals ? "✅" : "❌"}</td>
        </tr>`;
      entriesTable.innerHTML += row;
    });

  // Update chart
  weightChart.data.labels = entries.map((e) => e.date);
  weightChart.data.datasets[0].data = entries.map((e) => parseFloat(e.weight));
  weightChart.update();

  // Update milestones
  milestonesList.innerHTML = "";
  if (entries.length > 0) {
    const startWeight = parseFloat(entries[0].weight);
    const achieved = [];
    entries.forEach((e) => {
      const diff = startWeight - parseFloat(e.weight);
      const milestone = Math.floor(diff / 2) * 2;
      if (diff >= 2 && !achieved.includes(milestone)) {
        achieved.push(milestone);
      }
    });
    achieved.forEach((m) => {
      milestonesList.innerHTML += `<li>Lost ${m} kg ✅</li>`;
    });
  }
}

addEntryBtn.addEventListener("click", () => {
  if (!dateInput.value || !weightInput.value)
    return alert("Date & Weight required!");
  const entry = {
    date: dateInput.value,
    weight: weightInput.value,
    water: waterInput.value,
    sleep: sleepInput.value,
    steps: stepsInput.value,
    workout: workoutInput.checked,
    meals: mealsInput.checked,
  };
  entries.push(entry);
  localStorage.setItem("trackerEntries", JSON.stringify(entries));
  updateDisplay();

  // Clear form
  dateInput.value = "";
  weightInput.value = "";
  waterInput.value = "";
  sleepInput.value = "";
  stepsInput.value = "";
  workoutInput.checked = false;
  mealsInput.checked = false;
});

updateDisplay();
