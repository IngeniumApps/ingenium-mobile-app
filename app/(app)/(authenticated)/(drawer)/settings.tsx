import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Color } from "@/types/theme";

const Page = () => {
  const { toggleTheme, colors } = useThemeStore();
  const styles = dynamicStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
      <TouchableOpacity onPress={toggleTheme} style={styles.button}>
        <Text style={[styles.text, styles.buttonText]}>Toggle Theme</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;

const dynamicStyles = (colors: Color) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      backgroundColor: colors.accent,
      padding: 10,
      margin: 10,
      borderRadius: 5,
      textAlign: "center",
    },
    text: {
      color: colors.label,
      textAlign: "center",
    },
    buttonText: {
      color: colors.lightNeutral,
    },
  });
};
