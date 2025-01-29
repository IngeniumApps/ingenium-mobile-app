import * as SecureStore from "expo-secure-store";

/**
 * Saves a key-value pair to the secure store.
 * @param {string} key - The key to identify the value.
 * @param {string} value - The value to be stored.
 * @returns {Promise<void>} A promise that resolves when the value is saved.
 */
export const saveToSecureStore = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  } catch (error) {
    console.error(`❌ Fehler beim Speichern von ${key}:`, error);
  }
};

/**
 * Retrieves a value from the secure store by its key.
 * @param {string} key - The key to identify the value.
 * @returns {Promise<string | null>} A promise that resolves with the retrieved value, or null if an error occurs.
 */
export const getFromSecureStore = async (
  key: string,
): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`❌ Fehler beim Abrufen von ${key}:`, error);
    return null;
  }
};

/**
 * Deletes a key-value pair from the secure store.
 * @param {string} key - The key to identify the value to be deleted.
 * @returns {Promise<void>} A promise that resolves when the value is deleted.
 */
export const deleteFromSecureStore = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`❌ Fehler beim Löschen von ${key}:`, error);
  }
};
