// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB6NBVMcCS-V8Ly-OR3Yres3KJ5k9aXXHA",
    authDomain: "food-tracker-storage-33635.firebaseapp.com",
    projectId: "food-tracker-storage-33635",
    storageBucket: "food-tracker-storage-33635.firebasestorage.app",
    messagingSenderId: "393831960963",
    appId: "1:393831960963:web:2f21d8bc3abb905e2be6b6",
    measurementId: "G-3KX1K6P9S7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);