import { StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import { useThemeStore } from "@/store/themeStore";
import { ICON } from "@/constants/Images";
import { Color } from "@/types/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo } from "react";

interface ScrollToTopButtonProps {
    /**
     * The animated style applied to the button, typically used to control visibility.
     */
    buttonStyle: StyleProp<ViewStyle>;
    /**
     * The function to call when the button is pressed.
     */
    onPress: () => void;
}

/**
 * `ScrollToTopButton` is a reusable component that displays an animated button
 * for scrolling to the top of the screen. The button is styled dynamically
 * based on the app's theme.
 *
 * @param {ScrollToTopButtonProps} props - The properties for configuring the `ScrollToTopButton` component.
 *
 * @example
 * <ScrollToTopButton
 *    buttonStyle={animatedStyle}
 *    onPress={() => scrollToTop()}
 * />
 */
const ScrollToTopButton = ({ buttonStyle, onPress }: ScrollToTopButtonProps) => {
    const { colors } = useThemeStore();
    const insets = useSafeAreaInsets();

    // Memoized styles for improved performance
    const styles = useMemo(() => dynamicStyles(colors), [colors]);

    return (
        <Animated.View style={[buttonStyle, styles.container, { bottom: insets.bottom }]}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <Image style={styles.image} source={ICON.up} />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default ScrollToTopButton;

/**
 * Generates dynamic styles for the `ScrollToTopButton` component.
 *
 * @param {Color} colors - The theme-based color settings.
 */
const dynamicStyles = (colors: Color) => {
    return StyleSheet.create({
        /**
         * Container style for the animated button.
         */
        container: {
            position: 'absolute',
            right: 20,
            width: 56,
            height: 56,
            borderRadius: 30,
            backgroundColor: colors.accent,
            justifyContent: 'center',
            alignItems: 'center',
        },
        /**
         * Style for the button's image icon.
         */
        image: {
            width: 30,
            height: 30,
            tintColor: colors.lightNeutral,
        }
    });
};