import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Color, FontSize } from "@/types/theme";
import { Image } from "expo-image";
import { ThemeSizes } from "@/constants/ThemeSizes";
import useNavStore from "@/store/navStore";
import { Route, useRouter} from "expo-router";
import useAuthStore from "@/store/authStore";
import React from "react";

type CustomDrawerItemProps = {
  /** The label to display for the drawer item */
  label: string;
  /** The route to navigate to when the item is pressed */
  route: Route;
  /** The icon to display when the item is active */
  iconActive?: string;
  /** The icon to display when the item is inactive */
  iconInactive?: string;
};

export function CustomDrawerItem({
  label,
  route,
  iconActive,
  iconInactive,
}: CustomDrawerItemProps) {
  const { colors, fontSize } = useThemeStore();
  const { currentRoute, setCurrentRoute } = useNavStore();
  const { logout } = useAuthStore();
  const router = useRouter();
  const styles = dynamicStyles(colors, fontSize);

  /** Handles user logout */
  const handleLogout = async () => {
    await logout();
    console.log("➡️ Logout erfolgreich");
  };

  /** Handles the press event for the drawer item */
  const handlePress = () => {
    console.log("➡️ DrawerItem - handlePress - Route:", route);

    // Prevent unnecessary re-renders
    if (currentRoute !== route) {
      setCurrentRoute(route);
    }

    // Handle navigation or logout based on the route
    route.toString() === "Logout" ? handleLogout() : router.push(route);
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.item, currentRoute === route && styles.itemActive]}
      >
        <Image
          source={currentRoute === route ? iconActive : iconInactive}
          tintColor={colors.label}
          style={styles.icon}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
        <Text
          style={[styles.text, currentRoute === route && styles.textActive]}
        >
          {label}
        </Text>
      </TouchableOpacity>
      <View style={styles.separator} />
    </>
  );
}

const dynamicStyles = (colors: Color, fontSize: FontSize) => {
  return StyleSheet.create({
    item: {
      flexDirection: "row",
      alignItems: "center",
      gap: ThemeSizes.Spacing.titleSpacingLeft,
      padding: ThemeSizes.Spacing.aroundSmall,
    },
    itemActive: {
      borderLeftWidth: 5,
      borderColor: colors.accent,
    },
    text: {
      fontSize: fontSize.body,
      color: colors.label,
      textTransform: "capitalize",
    },
    textActive: {},
    icon: {
      width: 24,
      height: 24,
    },
    separator: {
      height: 1,
      backgroundColor: colors.primary,
    },
  });
};
