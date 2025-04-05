
// Firebase configuration for Netflix
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, remove, onValue } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase for Netflix with a unique name to avoid conflicts
const netflixApp = initializeApp(firebaseConfig, "netflix");
const netflixDb = getDatabase(netflixApp);
const netflixAuth = getAuth(netflixApp);

/**
 * Gets data from Netflix Firebase
 * @param path - The path to the data
 * @returns Promise with the data snapshot
 */
export const getNetflixData = async (path: string) => {
  const dataRef = ref(netflixDb, path);
  const snapshot = await get(dataRef);
  return snapshot.val();
};

/**
 * Sets data in Netflix Firebase
 * @param path - The path to set the data
 * @param data - The data to set
 * @returns Promise that resolves when the data is set
 */
export const setNetflixData = async (path: string, data: any) => {
  const dataRef = ref(netflixDb, path);
  return set(dataRef, data);
};

/**
 * Updates data in Netflix Firebase
 * @param path - The path to update the data
 * @param data - The data to update
 * @returns Promise that resolves when the data is updated
 */
export const updateNetflixData = async (path: string, data: any) => {
  const dataRef = ref(netflixDb, path);
  return update(dataRef, data);
};

/**
 * Removes data from Netflix Firebase
 * @param path - The path to the data to remove
 * @returns Promise that resolves when the data is removed
 */
export const removeNetflixData = async (path: string) => {
  const dataRef = ref(netflixDb, path);
  return remove(dataRef);
};

/**
 * Listens for data changes in Netflix Firebase
 * @param path - The path to listen to
 * @param callback - The callback to call when the data changes
 * @returns The unsubscribe function
 */
export const subscribeToNetflixData = (path: string, callback: (data: any) => void) => {
  const dataRef = ref(netflixDb, path);
  return onValue(dataRef, (snapshot) => {
    callback(snapshot.val());
  });
};

/**
 * Signs in to Netflix Firebase
 * @param email - The email to sign in with
 * @param password - The password to sign in with
 * @returns Promise with the user credentials
 */
export const signInNetflix = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(netflixAuth, email, password);
};

export default netflixDb;
