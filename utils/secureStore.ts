import * as SecureStore from "expo-secure-store";

export const saveToSecureStore = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  } catch (error) {
    console.error(`❌ Fehler beim Speichern von ${key}:`, error);
  }
};

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

export const deleteFromSecureStore = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`❌ Fehler beim Löschen von ${key}:`, error);
  }
};
