import {
  StyleSheet,
  Text,
  TouchableOpacityProps,
  TouchableOpacity, View,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import {FontSize, Color, SpacingProps} from "@/types/theme";
import { ThemeSizes } from "@/constants/ThemeSizes";

interface SubmitButtonProps {
  title: string;
  onPress: () => void;
  spacing?: SpacingProps;
  props?: TouchableOpacityProps;
}

const SubmitButton = ({ title, onPress, spacing, props }: SubmitButtonProps) => {
  const { colors, fontSize } = useThemeStore();
  const styles = dynamicStyles(colors, fontSize);

  return (
    <View style={spacing}>
      <TouchableOpacity style={styles.button} onPress={onPress} {...props}>
        <Text style={styles.text} numberOfLines={1}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
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
      fontWeight: 600,
    },
  });
};
