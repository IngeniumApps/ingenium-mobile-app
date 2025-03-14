import { ReactNode, useMemo } from "react";
import { StyleSheet, Switch, TouchableOpacity, View, Text, Dimensions, ImageSourcePropType, StyleProp, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSizes } from "@/constants/ThemeSizes";
import { Color, FontSize } from "@/types/theme";
import { Route, useRouter} from "expo-router";
import { ICON } from "@/constants/Images";

/**
 * Props for the `Card` component.
 */
interface CardProps {
    /**
     * The text label displayed inside the card.
     */
    label?: string;
    /**
     * Image source to display inside the card (if any).
     */
    image?: ImageSourcePropType;
    /**
     * Child components to be rendered inside the card.
     */
    children?: ReactNode;
    /**
     * Custom styles for the card container.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * If `true`, the card will be rendered as a clickable component.
     */
    clickable?: boolean;
    /**
     * If `true`, the switch will have an alternative thumb color.
     */
    thumbColor?: boolean;
    /**
     * Function to execute when the card is pressed.
     */
    onPress?: () => void;
    /**
     * If `true`, a switch component will be displayed inside the card.
     */
    hasSwitch?: boolean;
    /**
     * Controls the state of the switch (on/off).
     */
    switchValue?: boolean;
    /**
     * Function triggered when the switch value changes.
     */
    onSwitchValueChange?: (value: boolean) => void;
    /**
     * The navigation route to navigate to when the card is clicked.
     */
    navigateTo?: Route;
}

/**
 * `Card` is a reusable component that displays a labeled container with an optional image and switch.
 * It can be clickable and support navigation.
 *
 * @param {CardProps} props - The properties for configuring the `Card` component.
 */
const Card = ({
    label,
    image,
    children,
    style,
    clickable = false,
    thumbColor,
    onPress,
    hasSwitch = false,
    switchValue,
    onSwitchValueChange,
    navigateTo
}: CardProps) => {
    // Retrieve theme colors and font sizes from Zustand store
    const { colors, fontSize } = useThemeStore();
    // Memoize styles to prevent unnecessary recalculations on re-renders
    const styles = useMemo(() => dynamicStyles(colors, fontSize), [colors, fontSize]);
    // Expo Router instance for navigation handling
    const router = useRouter();

    /**
     * Handles card press events.
     * - If `navigateTo` is defined, it navigates to the given route.
     * - Otherwise, it calls the `onPress` function if provided.
     */
    const handlePress = () => {
        if (navigateTo) {
            router.push(navigateTo); // Navigate to the specified route
        } else if (onPress) {
            onPress(); // Trigger custom click event
        }
    };

    return (
        <TouchableOpacity
            style={[styles.card, style]}
            onPress={clickable || navigateTo ? handlePress : undefined}
            activeOpacity={clickable || navigateTo ? 0.7 : 1} // Reduce opacity on press if clickable
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                {/* Render the image if provided */}
                {image && <Image style={styles.image} source={image} contentFit="contain" />}

                {/* Render the label if provided */}
                {label && (
                    <Text
                        style={hasSwitch ? styles.textWithSwitch : styles.text}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {label}
                    </Text>
                )}

                {/* Display an arrow icon if navigation is enabled */}
                {navigateTo && <Image style={styles.image} source={ICON.forward} contentFit="contain" />}
            </View>

            {/* Render children elements (if any) */}
            {children}

            {/* Render switch component if enabled */}
            {hasSwitch && (
                <Switch
                    trackColor={{ false: colors.gray_4, true: colors.gray_4 }}
                    thumbColor={thumbColor ? colors.accent : colors.secondary}
                    ios_backgroundColor={colors.gray_4}
                    onValueChange={onSwitchValueChange}
                    value={switchValue}
                />
            )}
        </TouchableOpacity>
    );
};

/**
 * Generates dynamic styles for the `Card` component based on theme settings.
 *
 * @param {Color} colors - Theme colors.
 * @param {FontSize} fontSizes - Theme font sizes.
 */
const dynamicStyles = (colors: Color, fontSizes: FontSize) => {
    const widthTextWithSwitch =
        Dimensions.get("screen").width - 2 * ThemeSizes.Spacing.horizontalDefault - 2 * ThemeSizes.Spacing.cardPadding - 72;

    return StyleSheet.create({
        /**
         * Card container style.
         */
        card: {
            padding: ThemeSizes.Spacing.cardPadding,
            marginBottom: ThemeSizes.Spacing.verticalSmall,
            backgroundColor: colors.secondary,
            borderRadius: ThemeSizes.Radius.card,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        /**
         * Image style.
         */
        image: {
            width: 30,
            height: 30,
            tintColor: colors.accent,
        },
        /**
         * Text style for the card label.
         */
        text: {
            fontWeight: "400",
            color: colors.label,
            textAlign: "left",
            fontSize: fontSizes.subhead,
            flex: 1,
        },
        /**
         * Text style when the switch is present.
         */
        textWithSwitch: {
            fontWeight: "400",
            color: colors.label,
            textAlign: "left",
            fontSize: fontSizes.subhead,
            width: widthTextWithSwitch,
        },
    });
};

export default Card;