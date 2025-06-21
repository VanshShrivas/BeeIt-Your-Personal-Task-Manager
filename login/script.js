import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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
const googleBtn = document.querySelector(".log_g");
const provider = new GoogleAuthProvider();


const emailInput = document.querySelector(".mail");
const passInput = document.querySelector(".password");
const loginBtn = document.querySelector(".submit");

document.addEventListener("contextmenu", function (e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});
googleBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            alert("Google login successful!");
            window.location.href = "/dashboard/index.html";
        })
        .catch((error) => {
            alert("Google login failed: " + error.message);
        });
});


loginBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passInput.value;

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login successful!");
            window.location.href = "/dashboard/index.html";
        })
        .catch((error) => {
            alert("Login failed: " + error.message);
        });
});