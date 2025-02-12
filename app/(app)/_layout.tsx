import { router, Slot, useSegments } from "expo-router";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

const AppLayout = () => {
  const { initializeAuth, isAuthenticated, initialized } = useAuthStore();
  const segments = useSegments();

  useEffect(() => {
  console.log("====================================");
    console.log("AKTUELLE SEGMENTE:", segments);
    console.log("====================================");
    console.log("segment[0]:", segments[0]);
    console.log("segment[1]:", segments[1]);
    console.log("segment[2]:", segments[2]);
    console.log("segment[3]:", segments[3]);
    console.log("segment[4]:", segments[4]);
    console.log("segment[5]:", segments[5]);
  }, [segments]);

  // Authentifizierung initialisieren
  useEffect(() => {
    const initialize = async () => {
      await initializeAuth(); // Dummy oder Backend-Logik ausführen
    };
    initialize();
  }, []);

  useEffect(() => {
    if (!initialized) {
      console.log(
        "🚧(app)/layout.tsx - Initialisierung läuft, Navigation pausiert.",
      );
      return;
    }

    // const isProtectedRoute = segments.includes("(authenticated)");
    const isProtected = segments[1] === "(authenticated)";
    console.log(
      "➡️(app)/layout.tsx - Navigation prüfen: isProtected =",
      isProtected,
    );

    if (isAuthenticated && !isProtected) {
      console.log(
        "🔓(app)/layout.tsx - Authentifiziert, Weiterleitung zur Home-Seite.",
      );
      router.replace("/");
    } else if (!isAuthenticated && isProtected) {
      console.log(
        "🔒(app)/layout.tsx - Nicht authentifiziert, Weiterleitung zur Login-Seite.",
      );
      router.replace("/login");
    }
  }, [initialized, isAuthenticated]);

  return <Slot />;
};

export default AppLayout;

/**
 * Damit rufst du beim Start initializeAuth() auf, lädst ggf. vorhandene Tokens, refreshst, lädst userData, startest den Timer.
 */
