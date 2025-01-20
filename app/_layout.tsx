import { Slot } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";

export default function RootLayout() {
  //  const {colorScheme} = useThemeStore(); // Zugriff auf den Dark/Light Mode

  useEffect(() => {
    const interval = setInterval(
      () => {
        useAuthStore
          .getState()
          .refreshAccessToken()
          .then(() => {
            console.log("🔁 Token erneuert");
          });
      },
      5 * 60 * 1000,
    ); // Alle 5 Minuten prüfen

    return () => clearInterval(interval); // Aufräumen bei Komponentendestruktion
  }, []);

  return (
    <GestureHandlerRootView>
      <KeyboardProvider>
        <Slot />
        <StatusBar
          //style={colorScheme === "light" ? "dark" : "light"} // Wechsel zwischen hell und dunkel
          style={"dark"}
          backgroundColor="transparent"
          translucent={true}
        />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
