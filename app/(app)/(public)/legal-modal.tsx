import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Pressable,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useThemeStore } from "@/store/themeStore";
import { Color, FontSize } from "@/types/theme";
import { BlurView } from "expo-blur";
import { ThemeSizes } from "@/constants/ThemeSizes";

const Page = () => {
  const { colors, fontSize, colorScheme } = useThemeStore();
  const styles = dynamicStyles(colors, fontSize);

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <BlurView
      intensity={100}
      style={styles.blurContainer}
      experimentalBlurMethod="dimezisBlurView"
    >
      <Animated.View
        entering={FadeIn}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colorScheme === "light" ? "#00000080" : "#00000050",
        }}
      >
        {/* Dismiss modal when pressing outside */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => router.dismiss()}
        />

        <Animated.View entering={SlideInDown} style={styles.modalContent}>
          <Text style={styles.modalHeader}>Rechtliche Informationen</Text>
          <Text style={styles.modalText}>
            Mit der Nutzung dieser App erklären Sie sich mit den{" "}
            <Text
              style={styles.link}
              onPress={() =>
                openLink("https://www.ingenium.co.at/datenschutzerklaerung")
              }
            >
              Datenschutzrichtlinien
            </Text>{" "}
            und der{" "}
            <Text
              style={styles.link}
              onPress={() =>
                openLink(
                  "https://ilias.ingenium.co.at/ilias.php?lang=de&client_id=ingenium&cmd=showTermsOfService&cmdClass=ilstartupgui&cmdNode=oj&baseClass=ilStartUpGUI",
                )
              }
            >
              Nutzungsvereinbarung
            </Text>{" "}
            von Ingenium Education und ILIAS einverstanden. Weitere rechtliche
            Informationen finden Sie in unserem{" "}
            <Text
              style={styles.link}
              onPress={() => openLink("https://www.ingenium.co.at/impressum")}
            >
              Impressum
            </Text>
            .
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.dismiss()}
          >
            <Text style={styles.closeButtonText}>Schließen</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </BlurView>
  );
};

export default Page;

const dynamicStyles = (colors: Color, fontSize: FontSize) => {
  return StyleSheet.create({
    blurContainer: {
      flex: 1,
      overflow: "hidden",
    },
    modalContent: {
      backgroundColor: colors.secondary,
      padding: ThemeSizes.Spacing.aroundDefault,
      borderRadius: ThemeSizes.Radius.card,
      width: "90%",
    },
    modalHeader: {
      fontSize: fontSize.title3,
      fontWeight: "bold",
      marginBottom: ThemeSizes.Spacing.fromHeader,
      textAlign: "left",
      color: colors.label,
    },
    modalText: {
      fontSize: fontSize.subhead,
      marginBottom: ThemeSizes.Spacing.verticalDefault,
      lineHeight: fontSize.subhead * 1.5,
      color: colors.label,
    },
    link: {
      color: colors.link,
      textDecorationLine: "underline",
    },
    closeButton: {
      alignSelf: "center",
      backgroundColor: colors.accent,
      padding: 10,
      borderRadius: ThemeSizes.Radius.button,
    },
    closeButtonText: {
      color: colors.lightNeutral,
      fontSize: fontSize.subhead,
    },
  });
};
