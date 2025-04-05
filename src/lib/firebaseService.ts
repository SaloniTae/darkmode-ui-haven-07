
// Unified Firebase service to provide consistent API across different services
import { 
  getData, setData, updateData, removeData, subscribeToData, signIn 
} from './firebase';
import { 
  getNetflixData, setNetflixData, updateNetflixData, removeNetflixData, 
  subscribeToNetflixData, signInNetflix 
} from './firebase-netflix';
import { 
  getPrimeData, setPrimeData, updatePrimeData, removePrimeData, 
  subscribeToPrimeData, signInPrime 
} from './firebase-prime';

export type ServiceType = 'crunchyroll' | 'netflix' | 'prime';

/**
 * Gets data from the specified service's Firebase
 * @param service - The service to get data from
 * @param path - The path to the data
 * @returns Promise with the data snapshot
 */
export const getServiceData = async (service: ServiceType, path: string) => {
  switch (service) {
    case 'crunchyroll':
      return getData(path);
    case 'netflix':
      return getNetflixData(path);
    case 'prime':
      return getPrimeData(path);
    default:
      throw new Error(`Unknown service: ${service}`);
  }
};

/**
 * Sets data in the specified service's Firebase
 * @param service - The service to set data in
 * @param path - The path to set the data
 * @param data - The data to set
 * @returns Promise that resolves when the data is set
 */
export const setServiceData = async (service: ServiceType, path: string, data: any) => {
  switch (service) {
    case 'crunchyroll':
      return setData(path, data);
    case 'netflix':
      return setNetflixData(path, data);
    case 'prime':
      return setPrimeData(path, data);
    default:
      throw new Error(`Unknown service: ${service}`);
  }
};

/**
 * Updates data in the specified service's Firebase
 * @param service - The service to update data in
 * @param path - The path to update the data
 * @param data - The data to update
 * @returns Promise that resolves when the data is updated
 */
export const updateServiceData = async (service: ServiceType, path: string, data: any) => {
  switch (service) {
    case 'crunchyroll':
      return updateData(path, data);
    case 'netflix':
      return updateNetflixData(path, data);
    case 'prime':
      return updatePrimeData(path, data);
    default:
      throw new Error(`Unknown service: ${service}`);
  }
};

/**
 * Removes data from the specified service's Firebase
 * @param service - The service to remove data from
 * @param path - The path to the data to remove
 * @returns Promise that resolves when the data is removed
 */
export const removeServiceData = async (service: ServiceType, path: string) => {
  switch (service) {
    case 'crunchyroll':
      return removeData(path);
    case 'netflix':
      return removeNetflixData(path);
    case 'prime':
      return removePrimeData(path);
    default:
      throw new Error(`Unknown service: ${service}`);
  }
};

/**
 * Listens for data changes in the specified service's Firebase
 * @param service - The service to listen to
 * @param path - The path to listen to
 * @param callback - The callback to call when the data changes
 * @returns The unsubscribe function
 */
export const subscribeToServiceData = (service: ServiceType, path: string, callback: (data: any) => void) => {
  switch (service) {
    case 'crunchyroll':
      return subscribeToData(path, callback);
    case 'netflix':
      return subscribeToNetflixData(path, callback);
    case 'prime':
      return subscribeToPrimeData(path, callback);
    default:
      throw new Error(`Unknown service: ${service}`);
  }
};

/**
 * Signs in to the specified service's Firebase
 * @param service - The service to sign in to
 * @param email - The email to sign in with
 * @param password - The password to sign in with
 * @returns Promise with the user credentials
 */
export const signInService = async (service: ServiceType, email: string, password: string) => {
  switch (service) {
    case 'crunchyroll':
      return signIn(email, password);
    case 'netflix':
      return signInNetflix(email, password);
    case 'prime':
      return signInPrime(email, password);
    default:
      throw new Error(`Unknown service: ${service}`);
  }
};

// Helper to check if a service uses gif_url instead of photo_url
export const usesGifUrl = (service: ServiceType): boolean => {
  return service === 'netflix' || service === 'prime';
};

// Re-export individual service methods for backward compatibility
export { 
  getData, setData, updateData, removeData, subscribeToData, signIn,
  getNetflixData, setNetflixData, updateNetflixData, removeNetflixData, subscribeToNetflixData, signInNetflix,
  getPrimeData, setPrimeData, updatePrimeData, removePrimeData, subscribeToPrimeData, signInPrime
};
