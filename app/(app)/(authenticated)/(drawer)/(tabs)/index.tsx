import { StyleSheet, View, Text } from "react-native";
import useAuthStore from "@/store/authStore";
import useUserStore from "@/store/userStore";
import React from "react";
import { ThemeSizes } from "@/constants/ThemeSizes";
import { useThemeStore } from "@/store/themeStore";
import { Color, FontSize } from "@/types/theme";
import BurgerMenu from "@/components/drawer/BurgerMenu";

const Page = () => {
  const { logout } = useAuthStore();
  const { userData } = useUserStore();
  const { colors, fontSize } = useThemeStore();
  const styles = dynamicStyles(colors, fontSize);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <BurgerMenu />
      <Text>HOME</Text>
      <Text>
        Welcome {userData?.firstname} {userData?.lastname}
      </Text>
      <Text onPress={handleLogout}>Sign Out</Text>
    </View>
  );
};

export default Page;

const dynamicStyles = (colors: Color, fontSize: FontSize) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingHorizontal: ThemeSizes.Spacing.horizontalDefault,
    },
    logo: {
      width: "100%",
      height: 100,
      marginBottom: ThemeSizes.Spacing.extraLarge,
    },
  });
};
