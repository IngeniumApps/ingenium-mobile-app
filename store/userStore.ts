import { create } from "zustand";
import { apiAuth } from "@/utils/apiClient";

interface UserState {
    userData: {
        userID: number;
        firstname: string;
        lastname: string;
        accountIsNotLocked: number; // Java-like Naming
        email: string;
        title: string;
        gender: string;
        institution: string;
        userAddress: {
            city: string;
            street: string;
            zipcode: string;
            country: string;
        };
    } | null;
    calendarData: any | null;
    icalUrl: string | null;
    loading: boolean;
    error: string | null;
}

interface UserActions {
    fetchUserData: (userID: number) => Promise<void>;
    fetchCalendarData: (userID: number) => Promise<void>;
    fetchIcalUrl: (userID: number) => Promise<void>;
    clearUserData: () => void;
}

const useUserStore = create<UserState & UserActions>((set) => ({
    userData: null,
    calendarData: null,
    icalUrl: null,
    loading: false,
    error: null,

    fetchUserData: async (userID) => {
        set({ loading: true, error: null });

        try {
            console.log(`🔄userStore.ts - Lade Benutzerdaten für UserID: ${userID}...`);
            const userData = await apiAuth.getUserData(userID);
            set({ userData });
            console.log("✅ userStore.ts - User-Daten erfolgreich geladen:", userData);
        } catch (err: any) {
            console.error("❌ userStore.ts - Fehler beim Laden der User-Daten:", err.message);
            set({ error: err.message, userData: null });
        } finally {
            set({ loading: false });
        }
    },

    fetchCalendarData: async (userID) => {
        set({ loading: true, error: null });

        try {
            console.log(`🔄userStore.ts - Lade Kalenderdaten für UserID: ${userID}...`);
            const calendarData = await apiAuth.getCalendarData(userID);
            set({ calendarData });
            console.log("✅ userStore.ts - Kalenderdaten erfolgreich geladen:", calendarData);
        } catch (err: any) {
            console.error("❌ userStore.ts - Fehler beim Laden der Kalenderdaten:", err.message);
            set({ error: err.message, calendarData: null });
        } finally {
            set({ loading: false });
        }
    },

    fetchIcalUrl: async (userID) => {
        set({ loading: true, error: null });

        try {
            console.log(`🔄userStore.ts - Lade ICAL URL für UserID: ${userID}...`);
            const icalUrl = await apiAuth.getIcalUrl(userID);
            set({ icalUrl });
            console.log("✅ userStore.ts - ICAL URL erfolgreich geladen:", icalUrl);
        } catch (err: any) {
            console.error("❌ userStore.ts - Fehler beim Laden der ICAL URL:", err.message);
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
