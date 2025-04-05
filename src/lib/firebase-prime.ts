
// Firebase configuration for Prime
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, remove, onValue } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase for Prime with a unique name to avoid conflicts
const primeApp = initializeApp(firebaseConfig, "prime");
const primeDb = getDatabase(primeApp);
const primeAuth = getAuth(primeApp);

/**
 * Gets data from Prime Firebase
 * @param path - The path to the data
 * @returns Promise with the data snapshot
 */
export const getPrimeData = async (path: string) => {
  const dataRef = ref(primeDb, path);
  const snapshot = await get(dataRef);
  return snapshot.val();
};

/**
 * Sets data in Prime Firebase
 * @param path - The path to set the data
 * @param data - The data to set
 * @returns Promise that resolves when the data is set
 */
export const setPrimeData = async (path: string, data: any) => {
  const dataRef = ref(primeDb, path);
  return set(dataRef, data);
};

/**
 * Updates data in Prime Firebase
 * @param path - The path to update the data
 * @param data - The data to update
 * @returns Promise that resolves when the data is updated
 */
export const updatePrimeData = async (path: string, data: any) => {
  const dataRef = ref(primeDb, path);
  return update(dataRef, data);
};

/**
 * Removes data from Prime Firebase
 * @param path - The path to the data to remove
 * @returns Promise that resolves when the data is removed
 */
export const removePrimeData = async (path: string) => {
  const dataRef = ref(primeDb, path);
  return remove(dataRef);
};

/**
 * Listens for data changes in Prime Firebase
 * @param path - The path to listen to
 * @param callback - The callback to call when the data changes
 * @returns The unsubscribe function
 */
export const subscribeToPrimeData = (path: string, callback: (data: any) => void) => {
  const dataRef = ref(primeDb, path);
  return onValue(dataRef, (snapshot) => {
    callback(snapshot.val());
  });
};

/**
 * Signs in to Prime Firebase
 * @param email - The email to sign in with
 * @param password - The password to sign in with
 * @returns Promise with the user credentials
 */
export const signInPrime = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(primeAuth, email, password);
};

export default primeDb;
