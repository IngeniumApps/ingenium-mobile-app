import { router, Slot, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";

const AppLayout = () => {
  const { initializeAuth, isAuthenticated, initialized } = useAuthStore();
  const segments = useSegments();

  // Authentifizierung initialisieren
  useEffect(() => {
    const initialize = async () => {
      await initializeAuth(); // Dummy oder Backend-Logik ausführen
    };
    initialize();
  }, []);

  useEffect(() => {
    if (!initialized) {
      console.log("🚧 Initialisierung läuft, Navigation pausiert.");
      return;
    }

    const isProtected = segments[1] === "(authenticated)";
    console.log("➡️ Navigation prüfen: isProtected =", isProtected);

    if (isAuthenticated && !isProtected) {
      console.log("🔓 Authentifiziert, Weiterleitung zur Home-Seite.");
      router.replace("/");
    } else if (!isAuthenticated && isProtected) {
      console.log("🔒 Nicht authentifiziert, Weiterleitung zur Login-Seite.");
      router.replace("/login");
    }
  }, [initialized, isAuthenticated]);

  return <Slot />;
};

export default AppLayout;
