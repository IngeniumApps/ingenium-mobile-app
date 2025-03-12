import React, {useEffect, useState} from 'react';
import { Image } from "expo-image";
import { ScrollView, View, StyleSheet, TouchableOpacity, StatusBar, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomDrawerItem } from "@/components/drawer/CustomDrawerItem";
import { useThemeStore } from "@/store/themeStore";
import { ICON, IMAGE } from "@/constants/Images";
import { Color, FontSize } from "@/types/theme";
import { ThemeSizes } from "@/constants/ThemeSizes";
import { bottomItems, externalLinks, topItems } from "@/utils/navigation/drawerRoutes";
import { BlurView } from "expo-blur";
import useNavStore from "@/store/navStore";
import {useSegments} from "expo-router";

type Props = {
    navigation: any;
};

const CustomDrawerContent = ({ navigation }: Props) => {
    const { colors, fontSize, colorScheme } = useThemeStore();
    const { bottom, top } = useSafeAreaInsets();
    const styles = dynamicStyles(colors, fontSize, bottom, top);

    const screenHeight = Dimensions.get("window").height;
    const [headerHeight, setHeaderHeight] = useState(0);
    const [footerHeight, setFooterHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);
    const isScrollEnabled = contentHeight > screenHeight; // Direkt berechnen

    const {currentRoute} = useNavStore();
    const segments = useSegments();

/*    useEffect(() => {
        console.log("Content Height: ", contentHeight);
        console.log("Screen Height: ", screenHeight);
    }, [contentHeight]);*/

    useEffect(() => {
        console.log("------------------------------------");
        console.log("(CustomDrawerContent.tsx) - Aktuelle Route:", currentRoute);
    }, [currentRoute]);

    useEffect(() => {
        console.log("====================================");
        console.log("🔍 Drawer - Segmente geändert:", segments);
    }, [segments]);

    const closeDrawer = () => {
        navigation.closeDrawer();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            {Platform.OS === "ios" ? (
                // BlurView only on iOS because of Android issues
                <BlurView
                    tint={colorScheme === "light" ? "light" : "dark"}
                    intensity={70}
                    style={styles.header}
                    onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
                >
                    <TouchableOpacity onPress={closeDrawer}>
                        <Image
                            style={styles.closeIcon}
                            source={ICON.close}
                            contentFit="contain"
                            tintColor={colors.label}
                            cachePolicy="memory-disk"
                        />
                    </TouchableOpacity>
                </BlurView>
            ) : (
                <View style={styles.header} onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>
                    <TouchableOpacity onPress={closeDrawer}>
                        <Image
                            style={styles.closeIcon}
                            source={ICON.close}
                            contentFit="contain"
                            tintColor={colors.label}
                            cachePolicy="memory-disk"
                        />
                    </TouchableOpacity>
                </View>
            )}

            {/* ScrollView für den Hauptinhalt */}
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "space-between",
                    paddingBottom: footerHeight,
                    paddingTop: headerHeight,
                }}
                scrollEnabled={isScrollEnabled}
                onContentSizeChange={(width, height) => {
                    //console.log("📌 Content Height (Hauptbereich):", height);
                    setContentHeight(height);
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.topItemContainer}>
                    <View style={styles.itemContainer}>
                        {topItems.map((item) => (
                            <CustomDrawerItem
                                key={item.route}
                                label={item.label}
                                route={item.route}
                                iconActive={item.iconActive}
                                iconInactive={item.iconInactive}
                            />
                        ))}
                    </View>
                    <View style={styles.itemContainer}>
                        {externalLinks.map((item) => (
                            <CustomDrawerItem
                                key={item.route}
                                label={item.label}
                                route={item.route}
                                iconActive={item.iconActive}
                                iconInactive={item.iconInactive}
                            />
                        ))}
                    </View>
                </View>
                <View>
                    <View style={styles.itemContainer}>
                        {bottomItems.map((item) => (
                            <CustomDrawerItem
                                key={item.route}
                                label={item.label}
                                route={item.route}
                                iconActive={item.iconActive}
                                iconInactive={item.iconInactive}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            {Platform.OS === "ios" ? (
                // BlurView only on iOS because of Android issues
                <BlurView
                    tint={colorScheme === "light" ? "light" : "dark"}
                    intensity={70}
                    style={styles.footer}
                    onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
                >
                    <Image
                        style={styles.logo}
                        source={IMAGE.logo_lettering}
                        contentFit="contain"
                        cachePolicy="memory-disk"
                    />
                </BlurView>
            ) : (
                <View style={styles.footer} onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}>
                    <Image
                        style={styles.logo}
                        source={IMAGE.logo_lettering}
                        contentFit="contain"
                        cachePolicy="memory-disk"
                    />
                </View>
            )}
        </View>
    );
}

export default CustomDrawerContent;

const dynamicStyles = (colors: Color, fontSize: FontSize, bottom: number, top: number) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
        },
        itemContainer: {
            backgroundColor: colors.secondary,
            borderRadius: ThemeSizes.Radius.card,
            marginHorizontal: ThemeSizes.Spacing.horizontalDefault,
        },
        topItemContainer: {
            gap: ThemeSizes.Spacing.verticalDefault,
        },
        header: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            paddingTop: Platform.OS === "ios" ? top : StatusBar.currentHeight || 24,
            paddingBottom: ThemeSizes.Spacing.extraDefault,
            zIndex: 2,
            backgroundColor: Platform.OS === "android" ? colors.primary : "transparent",
        },
        footer: {
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            alignItems: "center",
            paddingTop: ThemeSizes.Spacing.extraDefault,
            zIndex: 2,
            backgroundColor: Platform.OS === "android" ? colors.primary : "transparent",
        },
        logo: {
            width: "100%",
            height: 35,
            marginBottom: bottom,
        },
        closeIcon: {
            width: ThemeSizes.Sizes.largeIcon,
            height: ThemeSizes.Sizes.largeIcon,
            marginHorizontal: ThemeSizes.Spacing.horizontalDefault,
        }
    })
};