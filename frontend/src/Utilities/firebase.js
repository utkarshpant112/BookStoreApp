import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBfOHHX0Se5msLMpw-2u1f2TCuQtYJNdAo",
  authDomain: "etsy-lab1.firebaseapp.com",
  projectId: "etsy-lab1",
  storageBucket: "etsy-lab1.appspot.com",
  messagingSenderId: "798419167908",
  appId: "1:798419167908:web:957b901aa69a1a21255431",
  measurementId: "G-E7L82LMCTY",
};

const app = initializeApp(firebaseConfig);

export const storage_bucket = getStorage(app);
