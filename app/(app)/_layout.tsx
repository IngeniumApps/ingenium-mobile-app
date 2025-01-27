import { router, Slot, useSegments } from "expo-router";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

const AppLayout = () => {
  const { initializeAuth, isAuthenticated, initialized } = useAuthStore();
  const segments = useSegments();

  // Authentifizierung initialisieren
  useEffect(() => {
    initializeAuth();
  }, []);

  /*useEffect(() => {
    const initialize = async () => {
      await initializeAuth(); // Dummy oder Backend-Logik ausführen
    };
    initialize();
  }, []);*/

  useEffect(() => {
    if (!initialized) {
      console.log("🚧(app)/layout.tsx - Initialisierung läuft, Navigation pausiert.");
      return;
    }

    const isProtected = segments[1] === "(authenticated)";
    console.log("➡️(app)/layout.tsx - Navigation prüfen: isProtected =", isProtected);

    if (isAuthenticated && !isProtected) {
      console.log("🔓(app)/layout.tsx - Authentifiziert, Weiterleitung zur Home-Seite.");
      router.replace("/");
    } else if (!isAuthenticated && isProtected) {
      console.log("🔒(app)/layout.tsx - Nicht authentifiziert, Weiterleitung zur Login-Seite.");
      router.replace("/login");
    }
  }, [initialized, isAuthenticated]);

  return <Slot />;
};

export default AppLayout;

/**
 * Damit rufst du beim Start initializeAuth() auf, lädst ggf. vorhandene Tokens, refreshst, lädst userData, startest den Timer.
 */
