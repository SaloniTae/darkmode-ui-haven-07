
// Firebase configuration for Crunchyroll
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, remove, onValue } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase for Crunchyroll
const crunchyrollApp = initializeApp(firebaseConfig);
const crunchyrollDb = getDatabase(crunchyrollApp);
const crunchyrollAuth = getAuth(crunchyrollApp);

/**
 * Gets data from Crunchyroll Firebase
 * @param path - The path to the data
 * @returns Promise with the data snapshot
 */
export const getData = async (path: string) => {
  const dataRef = ref(crunchyrollDb, path);
  const snapshot = await get(dataRef);
  return snapshot.val();
};

/**
 * Sets data in Crunchyroll Firebase
 * @param path - The path to set the data
 * @param data - The data to set
 * @returns Promise that resolves when the data is set
 */
export const setData = async (path: string, data: any) => {
  const dataRef = ref(crunchyrollDb, path);
  return set(dataRef, data);
};

/**
 * Updates data in Crunchyroll Firebase
 * @param path - The path to update the data
 * @param data - The data to update
 * @returns Promise that resolves when the data is updated
 */
export const updateData = async (path: string, data: any) => {
  const dataRef = ref(crunchyrollDb, path);
  return update(dataRef, data);
};

/**
 * Removes data from Crunchyroll Firebase
 * @param path - The path to the data to remove
 * @returns Promise that resolves when the data is removed
 */
export const removeData = async (path: string) => {
  const dataRef = ref(crunchyrollDb, path);
  return remove(dataRef);
};

/**
 * Listens for data changes in Crunchyroll Firebase
 * @param path - The path to listen to
 * @param callback - The callback to call when the data changes
 * @returns The unsubscribe function
 */
export const subscribeToData = (path: string, callback: (data: any) => void) => {
  const dataRef = ref(crunchyrollDb, path);
  return onValue(dataRef, (snapshot) => {
    callback(snapshot.val());
  });
};

/**
 * Signs in to Crunchyroll Firebase
 * @param email - The email to sign in with
 * @param password - The password to sign in with
 * @returns Promise with the user credentials
 */
export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(crunchyrollAuth, email, password);
};

export default crunchyrollDb;
