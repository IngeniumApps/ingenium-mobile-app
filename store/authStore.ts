import { create } from "zustand";
import { tokenStorage } from "@/storages/tokenStorage";
import { apiAuth } from "@/utils/apiClient";
import useUserStore from "@/store/userStore";

interface AuthState {
    isAuthenticated: boolean;
    initialized: boolean;
    loading: boolean;
    error: string | null;
}

interface AuthActions {
    initializeAuth: () => Promise<void>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    isAuthenticated: false,
    initialized: false,
    loading: false,
    error: null,

    initializeAuth: async () => {
        set({ loading: true });
        try {
            console.log("🔄authStore.ts - Initialisierung startet...");

            const accessToken = await tokenStorage.getAccessToken();
            const refreshToken = await tokenStorage.getRefreshToken();

            if (!accessToken || !refreshToken) {
                console.log("❌ authStore.ts - Keine Tokens gefunden. Benutzer muss sich einloggen.");
                set({ isAuthenticated: false });
                return;
            }

            console.log("📦 authStore.ts - Tokens geladen:", { accessToken, refreshToken });

            // User-Daten laden
            await useUserStore.getState().fetchUserData(1);

            set({ isAuthenticated: true });

            console.log("✅ authStore.ts - Authentifizierung erfolgreich.");
        } catch (error) {
            console.error("❌ authStore.ts - Fehler bei der Auth-Initialisierung:", error);
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

            const { accessToken, refreshToken, userID } = await apiAuth.login(username, password);
            await tokenStorage.saveTokens(accessToken, refreshToken);

            console.log("✅ authStore.ts - Login erfolgreich. Benutzerdaten abrufen...");
            await useUserStore.getState().fetchUserData(userID);

            set({ isAuthenticated: true});
        } catch (err: any) {
            console.error("❌ authStore.ts - Login fehlgeschlagen:", err.message);
            set({ error: err.message, isAuthenticated: false });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        set({ loading: true });
        try {
            console.log("=====================================");
            console.log("🔑 authStore.ts - Logout startet...");
            await tokenStorage.deleteTokens();
            useUserStore.getState().clearUserData(); // 🗑️ User-Daten löschen

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
