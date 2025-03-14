import {
  StyleSheet,
  Text,
  TouchableOpacityProps,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { FontSize, Color, SpacingProps } from "@/types/theme";
import { ThemeSizes } from "@/constants/ThemeSizes";
import { useMemo } from "react";

/**
 * Props for the SubmitButton component.
 *
 * @property {string} title - The text displayed inside the button.
 * @property {() => void} onPress - Function executed when the button is pressed.
 * @property {SpacingProps} [spacing] - Defines spacing (margin and padding) properties for the button's container.
 * @property {TouchableOpacityProps} [props] - Additional properties forwarded to TouchableOpacity.
 */
interface SubmitButtonProps {
  title: string;
  onPress: () => void;
  spacing?: SpacingProps;
  props?: TouchableOpacityProps;
}

/**
 * SubmitButton is a reusable button component for triggering submit actions.
 *
 * It is styled dynamically based on the current theme's colors and font sizes.
 *
 * @param title
 * @param onPress
 * @param spacing
 * @param {SubmitButtonProps} props - The properties for configuring the button.
 *
 * @example
 * <SubmitButton title="Submit" onPress={handleSubmit} spacing={{ marginTop: 10 }} />
 */
const SubmitButton = ({
  title,
  onPress,
  spacing,
  props,
}: SubmitButtonProps) => {
  const { colors, fontSize } = useThemeStore();
  // Memoized styles to prevent unnecessary recalculations
  const styles = useMemo(() => dynamicStyles(colors, fontSize), [colors, fontSize]);

  return (
    <View style={spacing}>
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7} {...props}>
        <Text style={styles.text} numberOfLines={1}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubmitButton;

/**
 * Generates dynamic styles for the SubmitButton component based on theme settings.
 *
 * @param {Color} colors - The theme colors.
 * @param {FontSize} fontSizes - The theme font sizes.
 * @returns {object} A StyleSheet object containing dynamically generated styles.
 */
const dynamicStyles = (colors: Color, fontSizes: FontSize) => {
  return StyleSheet.create({
    /**
     * Button container style.
     */
    button: {
      height: ThemeSizes.Sizes.buttonHeight,
      backgroundColor: colors.accent,
      borderRadius: ThemeSizes.Radius.button,
      alignItems: "center",
      justifyContent: "center",
    },
    /**
     * Style for the button text.
     */
    text: {
      color: colors.lightNeutral,
      fontSize: fontSizes.title3,
      fontWeight: "600",
    },
  });
};
