import {Slot} from "expo-router";
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {StatusBar} from "expo-status-bar";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function RootLayout() {
    //  const {colorScheme} = useThemeStore(); // Zugriff auf den Dark/Light Mode
    return (
        <GestureHandlerRootView>
            <KeyboardProvider>
                <Slot/>
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
