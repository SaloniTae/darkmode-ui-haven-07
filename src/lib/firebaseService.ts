
import { database } from "./firebase";
import { primeDatabase } from "./firebase-prime";
import { netflixDatabase } from "./firebase-netflix";
import { ref, get, set, remove, update, onValue, off, Database } from "firebase/database";

// Factory function to create platform-specific service
export const createFirebaseService = (platform: 'default' | 'prime' | 'netflix' = 'default') => {
  let db: Database;
  
  switch (platform) {
    case 'prime':
      db = primeDatabase;
      break;
    case 'netflix':
      db = netflixDatabase;
      break;
    default:
      db = database; // Crunchyroll database is the default
  }
  
  // Database helper functions
  const fetchData = async (path: string) => {
    const dataRef = ref(db, path);
    const snapshot = await get(dataRef);
    return snapshot.exists() ? snapshot.val() : null;
  };

  const updateData = async (path: string, data: any) => {
    const dataRef = ref(db, path);
    await update(dataRef, data);
    return data;
  };

  const setData = async (path: string, data: any) => {
    const dataRef = ref(db, path);
    await set(dataRef, data);
    return data;
  };

  const removeData = async (path: string) => {
    const dataRef = ref(db, path);
    await remove(dataRef);
    return true;
  };

  // Realtime listener functions
  const subscribeToData = (path: string, callback: (data: any) => void) => {
    const dataRef = ref(db, path);
    onValue(dataRef, (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : null;
      callback(data);
    });
    
    // Return unsubscribe function
    return () => off(dataRef);
  };
  
  return {
    fetchData,
    updateData,
    setData,
    removeData,
    subscribeToData
  };
};

// Export default service instances for backward compatibility
export const {
  fetchData,
  updateData,
  setData,
  removeData,
  subscribeToData
} = createFirebaseService('default'); // Crunchyroll

export const {
  fetchData: fetchPrimeData,
  updateData: updatePrimeData,
  setData: setPrimeData,
  removeData: removePrimeData,
  subscribeToData: subscribeToPrimeData
} = createFirebaseService('prime');

export const {
  fetchData: fetchNetflixData,
  updateData: updateNetflixData,
  setData: setNetflixData,
  removeData: removeNetflixData,
  subscribeToData: subscribeToNetflixData
} = createFirebaseService('netflix');
