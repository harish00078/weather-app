import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT.appspot.com",
//   messagingSenderId: "SENDER_ID",
//   appId: "APP_ID"
// };
const firebaseConfig = {
  apiKey: "AIzaSyAaQ7KxklGHrNX7JxYce1_OsduEVYV-PE0",
  authDomain: "favorable-tree-408504.firebaseapp.com",
  projectId: "favorable-tree-408504",
  storageBucket: "favorable-tree-408504.firebasestorage.app",
  messagingSenderId: "361094047734",
  appId: "1:361094047734:web:f4eb05d2ac4f0390b049d7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);