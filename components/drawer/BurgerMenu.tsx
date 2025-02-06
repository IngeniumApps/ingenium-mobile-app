import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeStore } from "@/store/themeStore";
import { useNavContext } from "@/context/NavContext";
import { ICON } from "@/constants/Images";
import { ThemeSizes } from "@/constants/ThemeSizes";
import {useNavigation} from "expo-router";
import {DrawerActions} from "@react-navigation/native";

type Props = {
    title?: string;
};

const BurgerMenu = ({ title }: Props) => {
    const insets = useSafeAreaInsets();
    const { colors, fontSize } = useThemeStore();
    const styles = getStyles(colors, fontSize, insets);

    const nav = useNavigation();

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => nav.dispatch(DrawerActions.openDrawer())}>
                <Image
                    source={ICON.menu}
                    style={styles.icon}
                    tintColor={colors.label}
                    cachePolicy="memory-disk"
                />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
};

export default BurgerMenu;

const getStyles = (colors: any, fontSize: any, insets: any) =>
    StyleSheet.create({
        headerContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            //paddingHorizontal: ThemeSizes.Spacing.horizontalDefault,
            paddingTop: insets.top,
            paddingBottom: ThemeSizes.Spacing.extraDefault,
        },
        icon: {
            width: ThemeSizes.Sizes.largeIcon,
            height: ThemeSizes.Sizes.largeIcon,
        },
        headerTitle: {
            flex: 1,
            textAlign: "right",
            fontSize: fontSize.title1,
            fontWeight: "600",
            color: colors.label,
        },
    });
