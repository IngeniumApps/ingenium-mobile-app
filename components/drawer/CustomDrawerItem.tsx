import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {useThemeStore} from "@/store/themeStore";
import {Color, FontSize} from "@/types/theme";
import {Image} from "expo-image";
import {ThemeSizes} from "@/constants/ThemeSizes";

type CustomDrawerItemProps = {
    label: string;
    isActive: boolean;
    iconActive?: string;
    iconInactive?: string;
    onPress: () => void;
};

export function CustomDrawerItem({
                                     label,
                                     isActive,
                                     iconActive,
                                     iconInactive,
                                     onPress,
                                 }: CustomDrawerItemProps) {

    const {colors, fontSize} = useThemeStore();
    const styles = dynamicStyles(colors, fontSize);


    return (
        <>
            <TouchableOpacity
                onPress={onPress}
                style={[styles.item, isActive && styles.itemActive]}
            >
                <Image
                    source={isActive ? iconActive : iconInactive}
                    tintColor={colors.label}
                    style={styles.icon}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                />
                <Text style={[styles.text, isActive && styles.textActive]}>
                    {label}
                </Text>
            </TouchableOpacity>
            <View style={styles.separator}/>
        </>
    );
}

const dynamicStyles = (
    colors: Color,
    fontSize: FontSize,
) => {
    return StyleSheet.create({
        item: {
            flexDirection: "row",
            alignItems: "center",
            gap: ThemeSizes.Spacing.titleSpacingLeft,
            padding: ThemeSizes.Spacing.aroundSmall,
        },
        itemActive: {
            borderLeftWidth: 5,
            borderColor: colors.accent,
        },
        text: {
            fontSize: fontSize.body,
            color: colors.label,
            textTransform: 'capitalize',
        },
        textActive: {
        },
        icon: {
            width: 24,
            height: 24,
        },
        separator: {
            height: 1,
            backgroundColor: colors.primary,
        }
    })
};