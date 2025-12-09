// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfYVJCSwuwpj0jNZ-ThEamoGM8xaPM0pM",
  authDomain: "todo-first-1e981.firebaseapp.com",
  projectId: "todo-first-1e981",
  storageBucket: "todo-first-1e981.firebasestorage.app",
  messagingSenderId: "345259021490",
  appId: "1:345259021490:web:10809182de636476b925ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);