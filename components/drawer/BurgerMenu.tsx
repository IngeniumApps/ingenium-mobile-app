import React, { useMemo } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageStyle } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeStore } from "@/store/themeStore";
import { ICON } from "@/constants/Images";
import { ThemeSizes } from "@/constants/ThemeSizes";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { appStyles } from "@/constants/Styles";
import { Color, FontSize } from "@/types/theme";

type Props = {
    /**
     * The title displayed in the header.
     */
    title?: string;
};

/**
 * `BurgerMenu` is a reusable header component that displays a menu icon
 * and a title. The menu icon opens a navigation drawer.
 *
 * @param {Props} props - The properties for configuring the `BurgerMenu`.
 *
 * @example
 * <BurgerMenu title="Dashboard" />
 */
const BurgerMenu = ({ title }: Props) => {
    const insets = useSafeAreaInsets();
    const { colors, fontSize } = useThemeStore();
    const styles = useMemo(() => getStyles(colors, fontSize, insets), [colors, fontSize, insets.top]);
    const defaultStyles = useMemo(() => appStyles(fontSize, colors), [fontSize, colors]);
    const nav = useNavigation();

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => nav.dispatch(DrawerActions.openDrawer())}>
                <Image source={ICON.menu} style={styles.icon} tintColor={colors.label} cachePolicy="memory-disk" />
            </TouchableOpacity>
            <Text style={defaultStyles.headerTitle}>{title}</Text>
        </View>
    );
};

export default BurgerMenu;

/**
 * Generates dynamic styles for the `BurgerMenu` component based on theme settings.
 *
 * @param {Color} colors - The theme colors.
 * @param {FontSize} fontSize - The theme font sizes.
 * @param {{ top: number }} insets - Safe area insets.
 */
const getStyles = (colors: Color, fontSize: FontSize, insets: { top: number }) =>
    StyleSheet.create({
        /**
         * Header container style.
         */
        headerContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: insets.top,
            paddingBottom: ThemeSizes.Spacing.extraDefault,
        },
        /**
         * Style for the menu icon.
         */
        icon: {
            width: ThemeSizes.Sizes.largeIcon,
            height: ThemeSizes.Sizes.largeIcon,
        } as ImageStyle,
    });