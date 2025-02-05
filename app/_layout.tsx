import {Slot} from "expo-router";
import {KeyboardProvider} from "react-native-keyboard-controller";
import {StatusBar} from "expo-status-bar";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import React, {useEffect} from "react";
import {useThemeStore} from "@/store/themeStore";
import * as NavigationBar from 'expo-navigation-bar';
import {Platform} from "react-native";
import {useAuthListener} from "@/hook/useAuthListener";

export default function RootLayout() {
    const {colorScheme, colors} = useThemeStore(); // Zugriff auf den Dark/Light Mode

    // transparent not working - open github issue on https://github.com/expo/expo/issues/19887
    useEffect(() => {
        if(Platform.OS === "android"){
            NavigationBar.setBackgroundColorAsync(colors.primary); // Setzen der Navigationsleistenfarbe
        }
    }, [colorScheme]); // Bei Änderung des Farbschemas aktualisieren

    // Activate the auth listener to monitor the session expiration event and log out the user when it occurs (see hook/useAuthListener.ts)
    useAuthListener();

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
