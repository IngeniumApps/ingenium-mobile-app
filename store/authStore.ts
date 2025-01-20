import { create } from "zustand";
import { authService, decodeJWT } from "@/service/authService";
import {
  deleteFromSecureStore,
  getFromSecureStore,
  saveToSecureStore,
} from "@/utils/secureStore";

const TOKEN_KEY = "authToken"; // Schlüssel für den Token im Secure Store
const REFRESH_TOKEN_KEY = "refreshToken"; // Schlüssel für den Refresh Token im Secure Store

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  userId: string | null;
  userData: Record<string, any> | null;
  isAuthenticated: boolean;
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  initializeAuth: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  handleRefreshToken: () => Promise<void>;
  getUserDetails: () => Promise<void>;
  isTokenValid: () => boolean;
}

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  token: null,
  refreshToken: null,
  expiresAt: null,
  userId: null,
  userData: null,
  isAuthenticated: false,
  initialized: false,
  loading: false,
  error: null,

  // Authentifizierung initialisieren
  initializeAuth: async () => {
    set({ loading: true });

    try {
      console.log("🔄 Initialisierung der Authentifizierung gestartet");

      // Tokens aus dem Secure Store laden
      const token = await getFromSecureStore(TOKEN_KEY);
      const refreshToken = await getFromSecureStore(REFRESH_TOKEN_KEY);

      console.log("📦 Geladener Access Token:", token);
      console.log("📦 Geladener Refresh Token:", refreshToken);

      if (!token || !refreshToken) {
        console.log("❌ Kein gültiges Token gefunden");
        set({ initialized: true, isAuthenticated: false });
        return;
      }

      const decodedToken = decodeJWT(token);
      console.log("📜 Dekodierter Token:", decodedToken);

      // Token ist abgelaufen, versuche Refresh
      if (
        !decodedToken ||
        !decodedToken.exp ||
        new Date(decodedToken.exp * 1000) < new Date()
      ) {
        console.log("⏳ Access Token abgelaufen. Versuche Refresh Token.");
        await get().handleRefreshToken();
        return;
      }

      console.log(
        "⏳ Access Token ist gültig bis:",
        new Date(decodedToken.exp * 1000).toISOString(),
      );

      set({
        token,
        refreshToken,
        expiresAt: new Date(decodedToken.exp * 1000).toISOString(),
        isAuthenticated: true,
        error: null,
      });

      await get().getUserDetails();
      console.log("✅ Authentifizierung erfolgreich initialisiert");
    } catch (error) {
      console.error("❌ Fehler bei der Initialisierung:", error);
      set({ error: "Fehler bei der Initialisierung" });
    } finally {
      set({ initialized: true, loading: false });
      console.log("✅ Initialisierung abgeschlossen");
    }
  },

  // Login
  login: async (username, password) => {
    set({ loading: true });

    try {
      console.log("🔑 Login gestartet für Benutzer:", username);

      const response = await authService.login(username, password);
      console.log("📦 Login-Response:", response);

      await saveToSecureStore(TOKEN_KEY, response.token);
      await saveToSecureStore(REFRESH_TOKEN_KEY, response.refreshToken);

      set({
        token: response.token,
        refreshToken: response.refreshToken,
        expiresAt: response.expiresAt,
        isAuthenticated: true,
        error: null,
      });

      console.log("✅ Login erfolgreich");
    } catch (error: any) {
      console.error("❌ Fehler beim Login:", error.message);

      set({
          error: error.message,
          isAuthenticated: false
      });

      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Logout
  logout: async () => {
    set({ loading: true });

    try {
      console.log("🔓 Logout gestartet");

      await deleteFromSecureStore(TOKEN_KEY);
      await deleteFromSecureStore(REFRESH_TOKEN_KEY);

      set({
        token: null,
        refreshToken: null,
        expiresAt: null,
        userId: null,
        userData: null,
        isAuthenticated: false,
      });

      console.log("✅ Logout erfolgreich");
    } catch (error) {
      console.error("❌ Fehler beim Logout:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Token-Refresh
  handleRefreshToken: async () => {
    const refreshToken = await getFromSecureStore(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      console.log("❌ Kein Refresh Token vorhanden");
      set({ isAuthenticated: false });
      return;
    }

    const decodedRefreshToken = decodeJWT(refreshToken);
    if (!decodedRefreshToken || decodedRefreshToken.exp * 1000 < Date.now()) {
      console.log("❌ Refresh Token ist abgelaufen");
      set({ isAuthenticated: false });
      return;
    }

    set({ loading: true });

    try {
      console.log("🔄 Token-Refresh gestartet");
      const response = await authService.refreshToken(refreshToken);

      await saveToSecureStore(TOKEN_KEY, response.token);
      await saveToSecureStore(REFRESH_TOKEN_KEY, response.refreshToken);

      set({
        token: response.token,
        refreshToken: response.refreshToken,
        expiresAt: response.expiresAt,
        isAuthenticated: true,
      });

      console.log("✅ Token erfolgreich aktualisiert");
    } catch (error) {
      console.error("❌ Fehler beim Token-Refresh:", error);
      set({ error: "Token-Refresh fehlgeschlagen", isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },

  // Benutzerdetails abrufen
  getUserDetails: async () => {
    set({ loading: true });

    try {
      const { token } = get();
      if (!token) {
        console.log("❌ Kein Token vorhanden für Benutzerdetails");
        throw new Error("Kein Token vorhanden");
      }

      console.log("🔄 Abrufen der Benutzerdetails mit Token:", token);

      const userData = await authService.fetchUserDetails(token);
      console.log("📦 Abgerufene Benutzerdetails:", userData);

      set({ userData, error: null });
      console.log("✅ Benutzerdetails erfolgreich abgerufen");
    } catch (error) {
      console.error("❌ Fehler beim Abrufen der Benutzerdetails:", error);
      set({ error: "Fehler beim Abrufen der Benutzerdetails." });
    } finally {
      set({ loading: false });
    }
  },

  // Token-Validierung
  isTokenValid: () => {
    const { token } = get();
    if (!token) return false;

    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000); // Zeit in Sekunden
    return decodedToken.exp > currentTime;
  },
}));

export default useAuthStore;
