import { create } from "zustand";
import { apiAuth } from "@/utils/api/apiClient";
import { UserData } from "@/types/auth";

/**
 * Interface representing the state of the user.
 */
interface UserState {
  userData: UserData | null;
  calendarData: any | null;
  icalUrl: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Interface representing the actions that can be performed on the user state.
 */
interface UserActions {
  /**
   * Fetches user data for the specified user ID from the API and updates the store.
   *
   * - Calls `apiAuth.getUserData(userID)`
   * - Updates `userData` in the store
   * - Handles errors and sets `error` if something goes wrong
   * @param {number} userID - The ID of the user.
   * @returns {Promise<void>} A promise that resolves when the user data is fetched.
   */
  fetchUserData: (userID: number) => Promise<void>;
  /**
   * Fetches calendar data for the specified user ID and updates the store.
   *
   * - Calls `apiAuth.getCalendarData(userID)`
   * - Updates `calendarData` in the store
   * - Handles errors and sets `error` if something goes wrong
   * @param {number} userID - The ID of the user.
   * @returns {Promise<void>} A promise that resolves when the calendar data is fetched.
   */
  fetchCalendarData: (userID: number) => Promise<void>;
  /**
   * Fetches the iCal URL for the specified user ID and updates the store.
   *
   * - Calls `apiAuth.getIcalUrl(userID)`
   * - Updates `icalUrl` in the store
   * - Handles errors and sets `error` if something goes wrong
   * @param {number} userID - The ID of the user.
   * @returns {Promise<void>} A promise that resolves when the iCal URL is fetched.
   */
  fetchIcalUrl: (userID: number) => Promise<void>;
  /**
   * Clear all user-related data from the Zustand store.
   *
   * - This is useful when logging out or switching users.
   */
  clearUserData: () => void;
}

/**
 * Zustand store for managing user state and actions.
 */
const useUserStore = create<UserState & UserActions>((set) => ({
  userData: null,
  calendarData: null,
  icalUrl: null,
  loading: false,
  error: null,

  fetchUserData: async (userID) => {
    set({ loading: true, error: null });

    try {
      console.log(
        `🔄userStore.ts - Lade Benutzerdaten für UserID: ${userID}...`,
      );

      // Call API to get user data
      const userData = await apiAuth.getUserData(userID);

      // Update Zustand store with the fetched user data
      set({ userData });
      console.log(
        "✅ userStore.ts - User-Daten erfolgreich geladen:",
        userData,
      );
    } catch (err: any) {
      console.error(
        "❌ userStore.ts - Fehler beim Laden der User-Daten:",
        err.message,
      );
      set({ error: err.message, userData: null });
    } finally {
      set({ loading: false });
    }
  },

  fetchCalendarData: async (userID) => {
    set({ loading: true, error: null });

    try {
      console.log(
        `🔄userStore.ts - Lade Kalenderdaten für UserID: ${userID}...`,
      );

      // Call API to get calendar data
      const calendarData = await apiAuth.getCalendarData(userID);

      // Update Zustand store with the fetched calendar data
      set({ calendarData });
      console.log(
        "✅ userStore.ts - Kalenderdaten erfolgreich geladen:",
        calendarData,
      );
    } catch (err: any) {
      console.error(
        "❌ userStore.ts - Fehler beim Laden der Kalenderdaten:",
        err.message,
      );
      set({ error: err.message, calendarData: null });
    } finally {
      set({ loading: false });
    }
  },

  fetchIcalUrl: async (userID) => {
    set({ loading: true, error: null });

    try {
      console.log(`🔄userStore.ts - Lade ICAL URL für UserID: ${userID}...`);

      // Call API to get iCal URL
      const icalUrl = await apiAuth.getIcalUrl(userID);

      // Update Zustand store with the fetched iCal URL
      set({ icalUrl });
      console.log("✅ userStore.ts - ICAL URL erfolgreich geladen:", icalUrl);
    } catch (err: any) {
      console.error(
        "❌ userStore.ts - Fehler beim Laden der ICAL URL:",
        err.message,
      );
      set({ error: err.message, icalUrl: null });
    } finally {
      set({ loading: false });
    }
  },

  clearUserData: () => {
    console.log("🗑️userStore.ts - User-Daten gelöscht.");
    set({ userData: null, calendarData: null, icalUrl: null });
  },
}));

export default useUserStore;
