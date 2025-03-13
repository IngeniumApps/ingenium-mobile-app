import { create } from "zustand";
import { tokenStorage } from "@/storages/tokenStorage";
import { apiAuth } from "@/utils/api/apiClient";
import useUserStore from "@/store/userStore";

/**
 * Interface defining the authentication state structure
 */
interface AuthState {
  isAuthenticated: boolean; // True if the user is logged in
  initialized: boolean; // True if the auth check has completed
  loading: boolean; // True when a login or logout is in progress
  error: string | null; // Stores any authentication error message
}
/**
 * Interface defining authentication actions.
 */
interface AuthActions {
  /**
   * Checks if the user is already authenticated by looking for stored tokens.
   * If tokens are found, it loads user data and sets authentication state.
   *
   * - Checks if there are stored tokens
   * - Loads user data if tokens exist
   * - Updates authentication state accordingly
   */
  initializeAuth: () => Promise<void>;
  /**
   * Logs in the user by sending credentials to the API.
   * If successful, it stores tokens and fetches user data.
   *
   * - Calls API to authenticate the user
   * - If successful, stores tokens and fetches user data
   * - If unsuccessful, sets an error message
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   */
  login: (username: string, password: string) => Promise<void>;
  /**
   * Logs out the user by deleting tokens and clearing user state.
   *
   * - Deletes stored tokens
   * - Clears user-related state
   * - Marks user as unauthenticated
   */
  logout: () => Promise<void>;
}

// Zustand store for managing authentication state
const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  isAuthenticated: false,
  initialized: false,
  loading: false,
  error: null,

  initializeAuth: async () => {
    set({ loading: true });
    try {
      console.log("🔄authStore.ts - Initialisierung startet...");

      // Retrieve tokens from SecureStore
      const accessToken = await tokenStorage.getAccessToken();
      const refreshToken = await tokenStorage.getRefreshToken();

      if (!accessToken || !refreshToken) {
        console.log(
          "❌ authStore.ts - Keine Tokens gefunden. Benutzer muss sich einloggen.",
        );
        set({ isAuthenticated: false });
        return;
      }

      console.log("📦 authStore.ts - Tokens geladen:", {
        accessToken,
        refreshToken,
      });

      // Load user data TODO: (using dummy user ID `1` for now, replace later if dynamic)
      await useUserStore.getState().fetchUserData(1);

      /**
       * Example: Fetching user ID from token or API
       * 🔹 Option 1: Extract userID from JWT Token (if backend supports it)
       *             let userID: number | null = null;
       *             try {
       *                 const decoded: { userID: number } = jwtDecode(accessToken);
       *                 userID = decoded.userID;
       *                 console.log("👤 authStore.ts - User ID aus Token extrahiert:", userID);
       *             } catch (err) {
       *                 console.warn("⚠️ authStore.ts - Konnte User ID nicht aus dem Token extrahieren.");
       *             }
       *
       * Example: Fetching user ID from the backend
       * 🔹 Option 2: Fetch userID from backend if not found in token
       *             if (!userID) {
       *                 const response = await apiAuth.getCurrentUser();
       *                 userID = response.userID;
       *                 console.log("👤 authStore.ts - User ID aus API erhalten:", userID);
       *             }
       *
       *             if (!userID) {
       *                 console.error("❌ authStore.ts - Konnte keine User ID ermitteln.");
       *                 set({ isAuthenticated: false });
       *                 return;
       *             }
       */

      set({ isAuthenticated: true });

      console.log("✅ authStore.ts - Authentifizierung erfolgreich.");
    } catch (error) {
      console.error(
        "❌ authStore.ts - Fehler bei der Auth-Initialisierung:",
        error,
      );
      set({ isAuthenticated: false, error: "Fehler bei Auth" });
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  login: async (username, password) => {
    set({ loading: true, error: null });

    try {
      console.log("=====================================");
      console.log("🔑authStore.ts - Login startet...");

      // Call the API to authenticate the user
      const { accessToken, refreshToken, userID } = await apiAuth.login(
        username,
        password,
      );

      // Store tokens in SecureStore
      await tokenStorage.saveTokens(accessToken, refreshToken);

      console.log(
        "✅ authStore.ts - Login erfolgreich. Benutzerdaten abrufen...",
      );

      // Fetch user data after login
      await useUserStore.getState().fetchUserData(userID);

      // Mark user as authenticated
      set({ isAuthenticated: true });
    } catch (err: any) {
      console.error("❌ authStore.ts - Login fehlgeschlagen:", err.message);
      set({ error: err.message, isAuthenticated: false });
      throw err; // Rethrow error for handling in UI
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      console.log("=====================================");
      console.log("🔑 authStore.ts - Logout startet...");

      // Delete tokens from SecureStore
      await tokenStorage.deleteTokens();

      // Clear user data from Zustand store
      useUserStore.getState().clearUserData();

      // Mark user as unauthenticated
      set({ isAuthenticated: false });

      console.log("✅ authStore.ts - Logout erfolgreich.");
    } catch (err) {
      console.error("❌ authStore.ts - Fehler beim Logout:", err);
      set({ error: "Fehler beim Logout" });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
