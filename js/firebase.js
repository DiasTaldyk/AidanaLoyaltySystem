// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBZULVPUwj34BC6s68DZkxP6AClrJfEXPE",
    authDomain: "loyaltysystem-8fe66.firebaseapp.com",
    projectId: "loyaltysystem-8fe66",
    storageBucket: "loyaltysystem-8fe66.firebasestorage.app",
    messagingSenderId: "289406975193",
    appId: "1:289406975193:web:a46d7ef89f3250631092c8",
    measurementId: "G-CN524V1LR8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };