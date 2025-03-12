import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Color, FontSize } from "@/types/theme";
import { Image } from "expo-image";
import { ThemeSizes } from "@/constants/ThemeSizes";
import useNavStore from "@/store/navStore";
import { useRouter } from "expo-router";
import useAuthStore from "@/store/authStore";

type CustomDrawerItemProps = {
  label: string;
  route: string;
  iconActive?: string;
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
  const router = useRouter();
  const styles = dynamicStyles(colors, fontSize);

  const handleLogout = () => {
    useAuthStore
      .getState()
      .logout()
      .then(() => {
        console.log("➡️ Logout erfolgreich");
      });
  };

  const handlePress = () => {
    console.log("➡️ DrawerItem - handlePress - Route:", route);

    // verhindere unnötige re-renders (TEST)
    if (currentRoute !== route) {
      setCurrentRoute(route);
    }

    if (route === "Logout") {
      handleLogout();
    } else {
      // @ts-ignore
      router.push(route);

      // not sure if this is the correct way to navigate
      // because it is not working right now
      //router.replace(route);
    }
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
