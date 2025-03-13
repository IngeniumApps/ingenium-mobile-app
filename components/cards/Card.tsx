import {ReactNode} from "react";
import {StyleSheet, Switch, TouchableOpacity, View, Text, Dimensions} from "react-native";
import {Image} from "expo-image";
import {useThemeStore} from "@/store/themeStore";
import {ThemeSizes} from "@/constants/ThemeSizes";
import {Color, FontSize} from "@/types/theme";

interface CardProps {
    label?: string;
    image?: any;
    children?: ReactNode;
    style?: any;
    clickable?: boolean;
    thumbColor?: boolean;
    onPress?: () => void;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchValueChange?: (value: boolean) => void;
}
/**
 * Card is a reusable component that displays a card with an optional image, label, and child content.
 * The card can also be optionally clickable and include a switch.
 * The styles for the card are generated dynamically based on the current theme's font sizes and colors,
 * which are provided by the useAppStyle context.
 *
 * @param {CardProps} props - The properties for configuring the Card component.
 * @param {string} [props.label] - Optional: The label text to display on the card.
 * @param {any} [props.image] - Optional: The image source to display on the card.
 * @param {ReactNode} [props.children] - Optional: The content to be displayed inside the card.
 * @param {any} [props.style] - Optional: Custom styles to apply to the card container.
 * @param {boolean} [props.clickable=false] - Optional: If true, the card is rendered as a TouchableOpacity and becomes clickable.
 * @param {boolean} [props.thumbColor] - Optional: The color of the thumb on the switch.
 * @param {() => void} [props.onPress] - Optional: The callback function triggered when the card is pressed.
 * @param {boolean} [props.hasSwitch=false] - Optional: If true, a switch is displayed on the card.
 * @param {boolean} [props.switchValue] - Optional: The value of the switch (on/off).
 * @param {() => void} [props.onSwitchValueChange] - Optional: The callback function triggered when the switch value changes.
 *
 * @example
 * <Card
 *    label="Card Label"
 *    image={require('path/to/image.png')}
 *    clickable={true}
 *    onPress={() => console.log('Card pressed')}
 *    hasSwitch={true}
 *    switchValue={true}
 *    onSwitchValueChange={(value) => console.log('Switch value:', value)}
 * >
 *    <Text>Child Content</Text>
 * </Card>
 */
const Card = (props:CardProps) => {
    const { colors, fontSize } = useThemeStore();
    // Calculate the width for the text when the switch is present
    const widthTextWithSwitch = Dimensions.get("screen").width -
        2 * ThemeSizes.Spacing.horizontalDefault -
        2 * ThemeSizes.Spacing.cardPadding - 30 - 10 - 62;
    const styles = dynamicStyles(colors, fontSize, widthTextWithSwitch);

    // Function to render the content inside the card
    const renderContent = () => (
        <>
            {/* Render the image if provided */}
            {props.image && <Image style={styles.image} source={props.image} contentFit={"contain"}/>}
            {/* Render the label if provided */}
            {props.label && (
                <Text style={props.hasSwitch ? styles.textWithSwitch : styles.text} numberOfLines={1} ellipsizeMode={"tail"}>
                    {props.label}
                </Text>
            )}
            {/* Render any children elements */}
            {props.children}
            {/* Render the switch if hasSwitch is true */}
            {props.hasSwitch && (
                <Switch
                    trackColor={{ false: colors.gray_4, true: colors.gray_4 }}
                    thumbColor={props.thumbColor ? colors.accent : colors.secondary}
                    ios_backgroundColor={colors.gray_4}
                    onValueChange={props.onSwitchValueChange}
                    value={props.switchValue}
                />
            )}
        </>
    );


    // If the card is clickable, render it as a TouchableOpacity
    if (props.clickable && props.onPress) {
        return (
            <TouchableOpacity style={[styles.card, props.style]} onPress={props.onPress}>
                {renderContent()}
            </TouchableOpacity>
        );
    }
    // Otherwise, render it as a simple View
    return <View style={[styles.card, props.style]}>{renderContent()}</View>
};

const dynamicStyles = (colors: Color, fontSizes: FontSize, widthTextWithSwitch: number) => {
    return StyleSheet.create({
        card: {
            padding: ThemeSizes.Spacing.cardPadding,
            marginBottom: ThemeSizes.Spacing.verticalSmall,
            backgroundColor: colors.secondary,
            borderRadius: ThemeSizes.Radius.card,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
        },
        image: {
            width: 30,
            height: 30,
            tintColor: colors.accent,
        },
        text: {
            //fontFamily: Fonts.regular,
            fontWeight: "400",
            color: colors.label,
            textAlign: "left",
            fontSize: fontSizes.subhead,
            width: "85%",
        },
        textWithSwitch: {
            //fontFamily: Fonts.regular,
            fontWeight: "400",
            color: colors.label,
            textAlign: "left",
            fontSize: fontSizes.subhead,
            //width: 230,
            width: widthTextWithSwitch,
        },
    });
}

export default Card;