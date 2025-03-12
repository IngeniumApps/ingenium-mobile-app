import { Platform, StyleSheet } from "react-native";
import { Tabs, useSegments } from "expo-router";
import { Image } from "expo-image";
import { ICON } from "@/constants/Images";
import React from "react";
import { useThemeStore } from "@/store/themeStore";
import { BlurView } from "expo-blur";
import useNavStore from "@/store/navStore";

const TabsLayout = () => {
  const { colors, fontSize, colorScheme } = useThemeStore();
  const { setCurrentRoute } = useNavStore();
  const segments: string[] = useSegments();

  return (
    <Tabs
      screenOptions={{
        popToTopOnBlur: true, // only works with a stack under the tab navigator
        headerShown: false,
        //headerTitle: "(Tabs) - Dashboard",
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.label,
        tabBarStyle: {
          backgroundColor:
            Platform.OS === "android" ? colors.primary : "transparent",
          borderTopColor: "transparent",
          position: "absolute",
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
          fontSize: fontSize.caption2,
        },
      }}
    >
      <Tabs.Screen
        name="timetable"
        options={{
          tabBarLabel: "Stundenplan",
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={focused ? ICON.timetable_active : ICON.timetable_inactive}
              tintColor={color}
              style={{ width: size, height: size }}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          ),
        }}
        listeners={{
          focus: () => {
            // listener to mark the current route in drawer
            setCurrentRoute("(tabs)/timetable");
          },
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={focused ? ICON.dashboard_active : ICON.dashboard_inactive}
              tintColor={color}
              style={{ width: size, height: size }}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          ),
        }}
        listeners={{
          focus: () => {
            // listener to mark the current route in drawer
            setCurrentRoute("(tabs)");
          },
        }}
      />
      <Tabs.Screen
        // Important: For highlighting the correct tab, use "isActive" because "focus" is not triggered
        // because we are using a redirect to navigate into a specific screen in the stack layout
        name="notification-redirect"
        options={{
          tabBarLabel: "Mitteilung",
          tabBarBadge: 3,
          tabBarLabelStyle: {
            color: segments.includes("notification")
              ? colors.accent
              : colors.label,
            fontSize: fontSize.caption2,
          },
          tabBarIcon: ({ color, size }) => {
            const isActive = segments.includes("notification");
            return (
              <Image
                source={
                  isActive
                    ? ICON.notification_active
                    : ICON.notification_inactive
                }
                tintColor={isActive ? colors.accent : color}
                style={{ width: size, height: size }}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
            );
          },
        }}
        listeners={{
          focus: () => {
            // don't mark the current route in drawer
            setCurrentRoute("(tabs)/task/notification");
          },
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          href: null,
        }}
        listeners={{
          focus: () => {
            // listener to mark the current route in drawer
            setCurrentRoute("(tabs)/tasks");
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
