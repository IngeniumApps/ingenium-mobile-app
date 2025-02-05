import { useEffect } from "react";
import authEventEmitter from "@/utils/api/eventEmitter";
import useAuthStore from "@/store/authStore";

/**
 * Custom hook to listen for authentication events like session expiration.
 * This hook listens for the "session_expired" event and logs out the user when it occurs.
 * This is integrated in the `RootLayout` component in `app/_layout.tsx` to monitor the session.
 *
 * The `eventEmitter.ts` file contains the `authEventEmitter` instance that is used to emit and listen for events.
 *
 * @see https://nodejs.org/api/events.html#events_class_eventemitter
 */
export const useAuthListener = () => {
    // Get the logout function from Zustand authStore
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        console.log("🔥 useAuthListener - Session Listener aktiv");

        // Function to handle session expiration
        const handleSessionExpired = () => {
            console.log("⚠️ useAuthListener - Session abgelaufen, Benutzer wird ausgeloggt...");
            logout(); // ⬅️ Call the logout function
        };

        // Register the event listener for "session_expired" event
        authEventEmitter.on("session_expired", handleSessionExpired);

        // Cleanup function: Remove the event listener when the component unmounts
        return () => {
            console.log("🔥 useAuthListener - Listener entfernt");
            authEventEmitter.off("session_expired", handleSessionExpired);
        };
    }, []);
};
