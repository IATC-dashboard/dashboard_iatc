// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
import {
  getDatabase,
  set,
  ref,
  onValue,
  push,
  child,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQOkWHmQ2TvVkkZTf_iHUVbv6XCkVLChA",
  authDomain: "iatc-cd289.firebaseapp.com",
  projectId: "iatc-cd289",
  storageBucket: "iatc-cd289.appspot.com",
  messagingSenderId: "390668681402",
  appId: "1:390668681402:web:ddd51138044b7f247dc283",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

export {
  set,
  ref,
  onValue,
  push,
  child,
  remove,
  update,
  getDatabase,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sRef,
  uploadBytesResumable,
  getDownloadURL
};
