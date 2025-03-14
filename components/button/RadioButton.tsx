import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from 'expo-image';
import { useThemeStore } from "@/store/themeStore";
import { Color, FontSize } from "@/types/theme";
import { ThemeSizes } from "@/constants/ThemeSizes";
import { useMemo } from "react";

interface RadioButtonProps {
    /**
     * The button object containing a label and an image.
     */
    button: {
        label: string;
        image: any;
    };
    /**
     * Indicates whether the radio button is currently selected.
     */
    isSelected: boolean;
    /**
     * The callback function triggered when the button is pressed.
     */
    onPress: () => void;
}

/**
 * `RadioButton` is a reusable component that displays a selectable button with an image and label.
 * The button can be selected or unselected, and the styles change accordingly.
 * The styles are dynamically generated based on the current theme's font sizes and colors.
 *
 * @param {RadioButtonProps} props - The properties for configuring the `RadioButton` component.
 *
 * @example
 * <RadioButton
 *    button={{ label: "Option 1", image: require('path/to/image.png') }}
 *    isSelected={true}
 *    onPress={() => console.log('Option 1 selected')}
 * />
 */
const RadioButton = ({ button, isSelected, onPress }: RadioButtonProps) => {
    const { colors, fontSize } = useThemeStore();

    // Memoized styles to prevent unnecessary recalculations
    const styles = useMemo(() => dynamicStyles(colors, fontSize), [colors, fontSize]);

    return (
        <TouchableOpacity onPress={isSelected ? undefined : onPress} disabled={isSelected}>
            <View style={styles.radioButton}>
                <Image
                    source={button.image}
                    style={styles.radioImage}
                    contentFit="contain"
                    transition={1000}
                />
                <Text style={styles.text}>{button.label}</Text>
                {isSelected ? (
                    <View style={styles.radioSelectedContainer}>
                        <View style={styles.radioSelected} />
                    </View>
                ) : (
                    <View style={styles.radioNotSelected} />
                )}
            </View>
        </TouchableOpacity>
    );
};

export default RadioButton;

/**
 * Generates dynamic styles for the `RadioButton` component based on theme settings.
 *
 * @param {Color} colors - Theme colors.
 * @param {FontSize} fontSizes - Theme-based font sizes.
 */
const dynamicStyles = (colors: Color, fontSizes: FontSize) => {
    return StyleSheet.create({
        /**
         * Container style for the entire button.
         */
        radioButton: {
            alignItems: "center",
            gap: 5
        },
        /**
         * Image style for the button's icon.
         */
        radioImage: {
            marginVertical: ThemeSizes.Spacing.verticalExtraSmall,
            width: 60,
            height: 100,
        },
        /**
         * Style for the selected radio button's inner circle.
         */
        radioSelected: {
            width: 10,
            height: 10,
            borderRadius: 10,
            backgroundColor: colors.accent
        },
        /**
         * Style for the selected radio button's outer container.
         */
        radioSelectedContainer: {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: "transparent",
            borderWidth: 2,
            borderColor: colors.accent,
            alignItems: 'center',
            justifyContent: 'center'
        },
        /**
         * Style for the unselected radio button.
         */
        radioNotSelected: {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: "transparent",
            borderWidth: 2,
            borderColor: colors.accent,
        },
        /**
         * Style for the text label.
         */
        text: {
            fontWeight: "600",
            color: colors.label,
            textAlign: "left",
            fontSize: fontSizes.subhead,
        }
    });
};