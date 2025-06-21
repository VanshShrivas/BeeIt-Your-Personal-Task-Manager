import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

document.addEventListener("contextmenu", function (e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTHORIZED_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "MESSAGINGsENDERiD",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const add_btn = document.querySelector(".add_icon");
const all_tasks = document.querySelector(".all_tasks");
const input_area = document.querySelector("#input_area");
const logout_btn = document.querySelector(".logout_button");

let currentUser = null;

// Auth Guarding
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loadTasks();
  } else {
    window.location.href = "/login/index.html";
  }
});

// Logout
logout_btn.addEventListener("click", () => {
  // Show confirmation dialog
  const shouldLogout = confirm("Are you sure you want to log out?");
  
  if (shouldLogout) {
    signOut(auth).then(() => {
      // Redirect after successful sign out
      window.location.href = "/index.html";
    }).catch((error) => {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    });
  }
});

// Add new task
add_btn.addEventListener("click", async () => {
  add_btn.style.backgroundColor = "#b5a7a765";
  setTimeout(() => {
    add_btn.style.backgroundColor = "rgba(247, 247, 39, 0.942)";
  }, 200);

  const value = input_area.value.trim();
  if (!value) {
    alert("Field is empty!");
    return;
  }

  await addDoc(collection(db, "tasks"), {
    text: value,
    completed: false,
    uid: currentUser.uid
  });

  input_area.value = "";
});

// Load tasks
function loadTasks() {
  const q = query(collection(db, "tasks"), where("uid", "==", currentUser.uid));
  onSnapshot(q, (snapshot) => {
    all_tasks.innerHTML = "";
    snapshot.forEach((docSnap) => {
      renderTask(docSnap.id, docSnap.data());
    });
  });
}

// Render task to UI
function renderTask(id, taskData) {
  const { text, completed } = taskData;

  let new_task = document.createElement("div");
  new_task.classList.add("task_item");

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task_checkbox");
  checkbox.checked = completed;

  let task_text = document.createElement("span");
  let finalText = text.charAt(0).toUpperCase() + text.slice(1);
  let words = finalText.split(" ");
  words = words.map(word => word.length > 20 ? word.slice(0, 20) + "..." : word);
  task_text.innerText = words.join(" ");
  task_text.style.flex = "1";
  task_text.style.fontFamily = "Poppins, sans-serif";

  let delete_btn = document.createElement("img");
  delete_btn.src = "/assets/trash1.png";
  delete_btn.classList.add("delete_icon");
  delete_btn.draggable = false;
  delete_btn.title = "Delete Task";

  new_task.style.display = "flex";
  new_task.style.alignItems = "center";
  new_task.style.justifyContent = "space-between";
  new_task.style.gap = "10px";

  // Toggle completion
  checkbox.addEventListener("change", async () => {
    await updateDoc(doc(db, "tasks", id), {
      completed: checkbox.checked
    });
  });

  // Delete task
  delete_btn.addEventListener("click", async () => {
    await deleteDoc(doc(db, "tasks", id));
  });

  // Visual strike if completed
  if (completed) {
    task_text.style.textDecoration = "line-through";
    task_text.style.opacity = "0.6";
  }

  checkbox.addEventListener("change", () => {
    task_text.style.textDecoration = checkbox.checked ? "line-through" : "none";
    task_text.style.opacity = checkbox.checked ? "0.6" : "1";
  });

  new_task.appendChild(checkbox);
  new_task.appendChild(task_text);
  new_task.appendChild(delete_btn);
  all_tasks.appendChild(new_task);
}
