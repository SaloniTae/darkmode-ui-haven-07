
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, remove, update, onValue, off } from "firebase/database";

// Firebase configuration for Crunchyroll
const firebaseConfig = {
  apiKey: "AIzaSyA2pIQ4la9Pgzg3uDe-iN5k3w_kahiXYkw",
  authDomain: "get-crunchy-credentials.firebaseapp.com",
  databaseURL: "https://get-crunchy-credentials-default-rtdb.firebaseio.com",
  projectId: "get-crunchy-credentials",
  storageBucket: "get-crunchy-credentials.firebasestorage.app",
  messagingSenderId: "96256317713",
  appId: "1:96256317713:web:152cc652466fc84e1654b0",
  measurementId: "G-5XKQEDN0GW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// Database helper functions
export const fetchData = async (path: string) => {
  const dataRef = ref(database, path);
  const snapshot = await get(dataRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const updateData = async (path: string, data: any) => {
  const dataRef = ref(database, path);
  await update(dataRef, data);
  return data;
};

export const setData = async (path: string, data: any) => {
  const dataRef = ref(database, path);
  await set(dataRef, data);
  return data;
};

export const removeData = async (path: string) => {
  const dataRef = ref(database, path);
  await remove(dataRef);
  return true;
};

// Realtime listener functions
export const subscribeToData = (path: string, callback: (data: any) => void) => {
  const dataRef = ref(database, path);
  onValue(dataRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : null;
    callback(data);
  });
  
  // Return unsubscribe function
  return () => off(dataRef);
};
