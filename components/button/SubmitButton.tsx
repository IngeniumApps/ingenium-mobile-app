import {
  StyleSheet,
  Text,
  TouchableOpacityProps,
  TouchableOpacity,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { FontSize, Color } from "@/types/themeTypes";
import { ThemeSizes } from "@/constants/ThemeSizes";

interface SubmitButtonProps {
  title: string;
  onPress: () => void;
  props?: TouchableOpacityProps;
}

const SubmitButton = ({ title, onPress, props }: SubmitButtonProps) => {
  const { colors, fontSize } = useThemeStore();
  const styles = dynamicStyles(colors, fontSize);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} {...props}>
      <Text style={styles.text} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;

const dynamicStyles = (colors: Color, fontSizes: FontSize) => {
  return StyleSheet.create({
    button: {
      height: ThemeSizes.Sizes.buttonHeight,
      backgroundColor: colors.accent,
      borderRadius: ThemeSizes.Radius.button,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: colors.lightNeutral,
      //fontFamily: Fonts.semiBold,
      fontSize: fontSizes.title3,
    },
  });
};
