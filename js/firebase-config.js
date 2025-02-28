import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

// Your Firebase configuration – update these with your project values
const firebaseConfig = {
  apiKey: "AIzaSyDHiylmQPdTFzoldJj42H9zIIdj5vBzbxU",
  authDomain: "neet-website-47a94.firebaseapp.com",
  projectId: "neet-website-47a94",
  storageBucket: "neet-website-47a94.appspot.com",  // Corrected bucket URL
  messagingSenderId: "159350497970",
  appId: "1:159350497970:web:36af9cce25f9556b8b9fab",
  measurementId: "G-S5J19V8ZEB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, analytics, database, storage };
