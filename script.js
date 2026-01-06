/* ===============================
   INTRO → APP TRANSITION
   Shows logo for 4 seconds,
   then loads the main application
=============================== */

window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const mainApp = document.getElementById("mainApp");

  // Safety check to avoid runtime errors
  if (!intro || !mainApp) {
    console.error("Intro or Main App missing");
    return;
  }

  // Hide main app initially
  mainApp.classList.add("hidden");

  // Show intro logo for 4 seconds
  setTimeout(() => {
    intro.classList.add("slide-left");

    // After slide animation, show the app
    setTimeout(() => {
      intro.style.display = "none";
      document.body.classList.add("app-active");
      mainApp.classList.remove("hidden");
    }, 1000);
  }, 4000);
});


/* ===============================
   NAVIGATION & LOGIN HANDLING
=============================== */

// Page sections
const homeSection = document.getElementById("home");
const loginSection = document.getElementById("login");
const trackerSection = document.getElementById("tracker");

// Navbar buttons
const navLogin = document.getElementById("navLogin");
const navLogout = document.getElementById("navLogout");

// Home page login button
document.getElementById("loginBtn").onclick = () => {
  homeSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
};


/* -------- LOGIN VALIDATION -------- */

document.getElementById("doLogin").onclick = () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const loginError = document.getElementById("loginError");

  // Validate empty fields
  if (!username || !password) {
    loginError.textContent = "Please enter username and password";
    return;
  }

  // Store logged-in user
  localStorage.setItem("loggedUser", username);

  // Navigate to tracker dashboard
  loginSection.classList.add("hidden");
  trackerSection.classList.remove("hidden");

  // Update navbar buttons
  navLogin.classList.add("hidden");
  navLogout.classList.remove("hidden");

  // Load user-specific transaction data
  loadUserData();
};

// Navbar login button
navLogin.onclick = () => {
  homeSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
};


/* -------- LOGOUT FUNCTION -------- */

navLogout.onclick = () => {
  // Remove logged user
  localStorage.removeItem("loggedUser");

  // Navigate back to home
  trackerSection.classList.add("hidden");
  homeSection.classList.remove("hidden");

  // Update navbar buttons
  navLogout.classList.add("hidden");
  navLogin.classList.remove("hidden");
};


/* ===============================
   EXPENSE TRACKER LOGIC
=============================== */

// Transaction array
let transactions = [];

// DOM references
const balanceEl = document.getElementById("balance");
const listEl = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const errorEl = document.getElementById("error");

const addSection = document.getElementById("addSection");
const historySection = document.getElementById("historySection");


/* -------- USER-SPECIFIC STORAGE KEY -------- */

// Creates a unique key for each logged-in user
function getUserKey() {
  const user = localStorage.getItem("loggedUser");
  return `transactions_${user}`;
}


/* -------- LOAD USER DATA -------- */

// Load transactions from local storage
function loadUserData() {
  transactions = JSON.parse(localStorage.getItem(getUserKey())) || [];
  renderTransactions();
  updateBalance();
}


/* -------- UI SECTION TOGGLE -------- */

document.getElementById("openAdd").onclick = () => {
  addSection.classList.remove("hidden");
  historySection.classList.add("hidden");
};

document.getElementById("openHistory").onclick = () => {
  historySection.classList.remove("hidden");
  addSection.classList.add("hidden");
};


/* -------- ADD TRANSACTION -------- */

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  let amount = Number(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  // Validation checks
  if (!name || !amount || amount === 0 || !type) {
    errorEl.textContent = "Please enter a valid amount";
    return;
  }

  // Convert amount automatically based on type
  amount = Math.abs(amount);
  if (type === "expense") amount = -amount;

  // Create transaction object
  const transaction = {
    id: Date.now(),
    name,
    amount,
    type
  };

  // Save transaction
  transactions.push(transaction);
  saveAndRender();

  // Reset form
  form.reset();
  errorEl.textContent = "";
});


/* -------- DELETE TRANSACTION -------- */

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveAndRender();
}


/* -------- SAVE & RENDER -------- */

// Save transactions to local storage
function saveAndRender() {
  localStorage.setItem(getUserKey(), JSON.stringify(transactions));
  renderTransactions();
  updateBalance();
}

// Display transaction list
function renderTransactions() {
  listEl.innerHTML = "";

  transactions.forEach(t => {
    const li = document.createElement("li");
    li.className = t.amount > 0 ? "income" : "expense";
    li.innerHTML = `
      <span>
        ${t.name}
        <small style="opacity:0.6">(${t.type})</small>
      </span>
      <span>${t.amount > 0 ? "+" : "-"}₹${Math.abs(t.amount)}</span>
      <button onclick="deleteTransaction(${t.id})">✕</button>
    `;
    listEl.appendChild(li);
  });
}


/* -------- BALANCE CALCULATION -------- */

// Calculate and update balance
function updateBalance() {
  const total = transactions.reduce((acc, t) => acc + t.amount, 0);
  balanceEl.textContent = total;
}


/* -------- NAVBAR HOME -------- */

document.getElementById("navHome").onclick = () => {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("tracker").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
};
