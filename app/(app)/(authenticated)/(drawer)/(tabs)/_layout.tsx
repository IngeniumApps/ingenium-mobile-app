import {
    Platform,
    StyleSheet,
} from "react-native";
import {Tabs, useNavigation} from "expo-router";
import {Image} from "expo-image";
import {ICON} from "@/constants/Images";
import React from "react";
import {useThemeStore} from "@/store/themeStore";
import {BlurView} from "expo-blur";
import {useNavContext} from "@/context/NavContext";

const TabsLayout = () => {
    const {colors, fontSize, colorScheme} = useThemeStore();
    const {setCurrentRoute} = useNavContext();
    const nav = useNavigation();

    return (
        <Tabs screenOptions={{
            headerShown: false,
            animation: "shift",
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.label,
            tabBarStyle: {
                backgroundColor: Platform.OS === "android" ? colors.primary : "transparent",
                borderTopColor: "transparent",
                position: 'absolute',
            },
            // BlurView only on iOS because of Android issues
            ...(Platform.OS === "ios" && {
                tabBarBackground: () => (
                    <BlurView
                        tint={colorScheme === "light" ? "light" : "dark"}
                        intensity={70}
                        style={StyleSheet.absoluteFill}
                        experimentalBlurMethod="dimezisBlurView"
                    />
                ),
            }),
            tabBarLabelStyle: {
                fontSize: fontSize.caption2
            },
        }
        }>
            <Tabs.Screen
                name="timetable"
                options={{
                    tabBarLabel: "Stundenplan",
                    tabBarIcon: ({color, size, focused}) => (
                        <Image
                            source={focused ? ICON.timetable_active : ICON.timetable_inactive}
                            tintColor={color}
                            style={{width: size, height: size}}
                            contentFit="contain"
                            cachePolicy="memory-disk"
                        />
                    )
                }}
                listeners={{
                    focus: () => {
                        setCurrentRoute("timetable-redirect");
                    }
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({color, size, focused}) => (
                        <Image
                            source={focused ? ICON.dashboard_active : ICON.dashboard_inactive}
                            tintColor={color}
                            style={{width: size, height: size}}
                            contentFit="contain"
                            cachePolicy="memory-disk"
                        />
                    )
                }}
                listeners={{
                    focus: () => {
                        setCurrentRoute("(tabs)");
                    }
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    tabBarLabel: "Mitteilung",
                    tabBarBadge: 3,
                    tabBarIcon: ({color, size, focused}) => (
                        <Image
                            source={focused ? ICON.notification_active : ICON.notification_inactive}
                            tintColor={color}
                            style={{width: size, height: size}}
                            contentFit="contain"
                            cachePolicy="memory-disk"
                        />
                    )
                }}
                listeners={{
                    focus: () => {
                        setCurrentRoute("notification-redirect");
                    }
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
