import {Slot} from "expo-router";
import {KeyboardProvider} from "react-native-keyboard-controller";
import {StatusBar} from "expo-status-bar";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import useAuthStore from "@/store/authStore";
import React, {useEffect} from "react";
import {useThemeStore} from "@/store/themeStore";
import * as NavigationBar from 'expo-navigation-bar';
import {Platform} from "react-native";

export default function RootLayout() {
    const {colorScheme, colors} = useThemeStore(); // Zugriff auf den Dark/Light Mode

    // transparent not working - open github issue on https://github.com/expo/expo/issues/19887
    useEffect(() => {
        if(Platform.OS === "android"){
            NavigationBar.setBackgroundColorAsync(colors.primary); // Setzen der Navigationsleistenfarbe
        }
    }, [colorScheme]); // Bei Änderung des Farbschemas aktualisieren

    useEffect(() => {
        const interval = setInterval(() => {
            useAuthStore
                .getState()
                .refreshAccessToken()
                .then(() => {
                    console.log("🔁 Token erneuert");
                })
                .catch((error) => {
                    console.error("⚠️ Fehler beim Token-Refresh:", error);
                });
        }, 5 * 60 * 1000); // Alle 5 Minuten prüfen

        return () => clearInterval(interval); // Aufräumen bei Komponentendestruktion
    }, []);

    return (
        <GestureHandlerRootView>
            <KeyboardProvider>
                <Slot/>
                <StatusBar
                    style={colorScheme === "light" ? "light" : "dark"} // Wechsel zwischen hell und dunkel
                    backgroundColor="transparent"
                    translucent={true}
                />
            </KeyboardProvider>
        </GestureHandlerRootView>
    );
}
