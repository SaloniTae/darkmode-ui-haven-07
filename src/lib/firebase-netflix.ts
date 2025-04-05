
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, remove, update, onValue, off } from "firebase/database";

// Firebase configuration for Netflix
const firebaseConfig = {
  apiKey: "AIzaSyBfN12Ig49lgQ4XoadRrJCn6FMMJ_PfTfI",
  authDomain: "get-accounts-netflix-prime.firebaseapp.com",
  databaseURL: "https://get-accounts-netflix-prime-default-rtdb.firebaseio.com",
  projectId: "get-accounts-netflix-prime",
  storageBucket: "get-accounts-netflix-prime.firebasestorage.app",
  messagingSenderId: "823566869236",
  appId: "1:823566869236:web:cb64bc9ff7a0e0a73734a1",
  measurementId: "G-MWPBL89RR7"
};

// Initialize Firebase for Netflix
const netflixApp = initializeApp(firebaseConfig, "netflix");
export const netflixDatabase = getDatabase(netflixApp);

// Database helper functions for Netflix
export const fetchNetflixData = async (path: string) => {
  const dataRef = ref(netflixDatabase, path);
  const snapshot = await get(dataRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const updateNetflixData = async (path: string, data: any) => {
  const dataRef = ref(netflixDatabase, path);
  await update(dataRef, data);
  return data;
};

export const setNetflixData = async (path: string, data: any) => {
  const dataRef = ref(netflixDatabase, path);
  await set(dataRef, data);
  return data;
};

export const removeNetflixData = async (path: string) => {
  const dataRef = ref(netflixDatabase, path);
  await remove(dataRef);
  return true;
};

// Realtime listener functions for Netflix
export const subscribeToNetflixData = (path: string, callback: (data: any) => void) => {
  const dataRef = ref(netflixDatabase, path);
  onValue(dataRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : null;
    callback(data);
  });
  
  // Return unsubscribe function
  return () => off(dataRef);
};
