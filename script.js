import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD3VEhlalUSHZUOG2uJLRIfSZk-RJD-948",
  authDomain: "leoni-event.firebaseapp.com",
  projectId: "leoni-event",
  storageBucket: "leoni-event.firebasestorage.app",
  messagingSenderId: "295625928769",
  appId: "1:295625928769:web:5799c4a560f0b245cb56c0",
  measurementId: "G-P6LTY25XY5"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

let selectedMeal = "";

window.selectMeal = function(card, meal){

  document.querySelectorAll(".meal-one")
    .forEach(c => c.classList.remove("selected"));

  card.classList.add("selected");

  selectedMeal = meal;
}

///////////////////////////////

window.submitForm = async function () {

  const name =
    document.getElementById("name").value.trim();

  if (name === "") {
    alert("Please enter your name.");
    return;
  }

  if (selectedMeal === "") {
    alert("Please select a lunch option.");
    return;
  }

  const now = new Date();

  try {

  await addDoc(
    collection(db, "mealSubmissions"),
    {
      name: name,
      meal: selectedMeal,

      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),

      timestamp: now.getTime()
    }
  );

    const btn = document.getElementById("submitBtn");

  btn.disabled = true;
  btn.innerHTML = "✅ Your lunch selection has been submitted successfully.";
  btn.style.background = "#d4f5df";
  btn.style.color = "#157347";
  btn.style.cursor = "default";
  
  document.getElementById("name").value = "";

  document.querySelectorAll(".meal-one")
    .forEach(c => c.classList.remove("selected"));

  selectedMeal = "";

  setTimeout(() => {

    const btn = document.getElementById("submitBtn");
    const success = document.getElementById("successMessage");

  btn.disabled = false;
  btn.innerHTML = "Submit Lunch Selection";
  btn.style.background = "";
  btn.style.color = "";
  btn.style.cursor = "pointer";

  }, 3000);

  loadTable();

} catch (error) {

  console.error(error);

  alert("Something went wrong.");
}
};

///////////////////////////////

window.loadTable = async function(){

  const tableBody =
    document.getElementById("tableBody");

  if(!tableBody) return;

  tableBody.innerHTML = "";

  const querySnapshot =
    await getDocs(
      collection(db, "mealSubmissions")
    );

  querySnapshot.forEach((doc)=>{

    const item = doc.data();

    tableBody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.meal}</td>
        <td>${item.date}</td>
        <td>${item.time}</td>
      </tr>
    `;
  });
}
// <td>${item.notes || "-"}</td>

///////////////////////////////

window.searchTable = function(){

  const input =
    document.getElementById("searchInput")
    .value.toLowerCase();

  const rows =
    document.querySelectorAll("#tableBody tr");

  rows.forEach(row => {

    const name =
      row.cells[0].innerText.toLowerCase();

    row.style.display =
      name.includes(input) ? "" : "none";
  });
}

///////////////////////////////

window.exportCSV = async function(){

  const querySnapshot =
    await getDocs(
      collection(db, "mealSubmissions")
    );

  const data = [];

  querySnapshot.forEach((doc)=>{

    const item = doc.data();

    data.push({
      Name: item.name,
      Meal: item.meal,
      // Notes: item.notes || "-",
      Date: item.date,
      Time: item.time
    });
  });

  const worksheet =
    XLSX.utils.json_to_sheet(data);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Meal Selections"
  );

  XLSX.writeFile(
    workbook,
    "LEONI_Meal_Selections.xlsx"
  );
}

loadTable();