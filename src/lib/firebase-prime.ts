
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, remove, update, onValue, off } from "firebase/database";

// Firebase configuration for Prime
const firebaseConfig = {
  apiKey: "AIzaSyD6GfoJEpYsh0GVUW0Dt4SxkRmYkJL1z1Y",
  authDomain: "get-prime-credentials.firebaseapp.com",
  databaseURL: "https://get-prime-credentials-default-rtdb.firebaseio.com",
  projectId: "get-prime-credentials",
  storageBucket: "get-prime-credentials.firebasestorage.app",
  messagingSenderId: "165662987948",
  appId: "1:165662987948:web:9692e1ae0bb03697657109",
  measurementId: "G-K3607PSZXG"
};

// Initialize Firebase for Prime
const primeApp = initializeApp(firebaseConfig, "prime");
export const primeDatabase = getDatabase(primeApp);

// Database helper functions for Prime
export const fetchPrimeData = async (path: string) => {
  const dataRef = ref(primeDatabase, path);
  const snapshot = await get(dataRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const updatePrimeData = async (path: string, data: any) => {
  const dataRef = ref(primeDatabase, path);
  await update(dataRef, data);
  return data;
};

export const setPrimeData = async (path: string, data: any) => {
  const dataRef = ref(primeDatabase, path);
  await set(dataRef, data);
  return data;
};

export const removePrimeData = async (path: string) => {
  const dataRef = ref(primeDatabase, path);
  await remove(dataRef);
  return true;
};

// Realtime listener functions for Prime
export const subscribeToPrimeData = (path: string, callback: (data: any) => void) => {
  const dataRef = ref(primeDatabase, path);
  onValue(dataRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : null;
    callback(data);
  });
  
  // Return unsubscribe function
  return () => off(dataRef);
};
