import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking, TouchableWithoutFeedback, Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { Color, FontSize } from "@/types/theme";
import { ThemeSizes } from "@/constants/ThemeSizes";
import { useThemeStore } from "@/store/themeStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ICON, IMAGE } from "@/constants/Images";
import { Image } from "expo-image";
import {
  KeyboardAvoidingView,
  KeyboardController,
} from "react-native-keyboard-controller";
import InputController from "@/components/forms/InputController";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodSchema } from "@/utils/validation";
import SubmitButton from "@/components/button/SubmitButton";
import useAuthStore from "@/store/authStore";
import { FormData } from "@/utils/validation";
import ActivityIndicator from "@/components/ActivityIndicatior";

const Page = () => {
  const router = useRouter();
  const { colors, fontSize } = useThemeStore();
  const { bottom, top } = useSafeAreaInsets();
  const styles = dynamicStyles(colors, fontSize, top, bottom);

  const [showPassword, setShowPassword] = useState(false);
  const {login, error: backendError, loading,} = useAuthStore();

  const {control, handleSubmit, formState: { errors }} = useForm<FormData>({
    resolver: zodResolver(zodSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "testuser",
      password: "password123",
    },
  });

  /**
   * Sends an email to reset the password for the account using the default email app.
   * The email includes a preset subject and body text asking for password reset help.
   */
  const handleForgotPassword = async () => {
    try {
      const subject = "Passwortrücksetzung für ILIAS-Konto";
      const body =
        "Sehr geehrtes Support-Team,\n" +
        "\n" +
        "Ich habe mein Passwort für mein ILIAS-Konto vergessen und benötige Ihre Hilfe, um es zurückzusetzen.\n" +
        "\n" +
        "Bitte setzen Sie mein Passwort zurück und senden Sie mir die Anweisungen zur Wiederherstellung.\n" +
        "\n" +
        "Vielen Dank im Voraus.\n" +
        "\n" +
        "Mit freundlichen Grüßen,\n";
      await Linking.openURL(
        `mailto:office@ingenium.co.at?subject=${subject}&body=${body}`,
      );
    } catch (error) {
      console.error("Error opening email app:", error);
    }
  };

  /**
   * Opens the external contact URL in a browser if it's supported.
   * If the URL is not supported, logs an error message.
   */
  const handleOpenContact = async () => {
    //canOpenURL checks if the given URL can be opened, the Promise resolves either to true or false
    const supportedURL = await Linking.canOpenURL(
      "https://www.ingenium.co.at/ueber-uns/kontakt",
    );
    //if it resolves to true, the website is opened, else an error is printed
    if (supportedURL) {
      await Linking.openURL("https://www.ingenium.co.at/ueber-uns/kontakt");
    } else {
      console.error("The contact link on login Screen is not supported");
    }
  };

  const openLegalPage = () => {
    //router.push(`/legal-modal/${type}`);
    router.push("/legal-modal/impressum");
  };

  // handleSubmit is triggered when the validation is successful, otherwise it won't be called
  const handleLogin = async (data: FormData) => {
    try {
      await login(data.username, data.password);
      // => tokens saved, userData set, timer started
      // => let the layout handle it to navigate to home
    } catch (error) {
      console.error(" (login.tsx) - ❌ Fehler beim Login:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.mainContainer}>
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={-60}
            style={styles.keyboardContainer}
        >
          {/*Image and Greeting*/}
          <View style={styles.headerSectionContainer}>
            <Image style={styles.logo} source={IMAGE.logo} contentFit="contain" />
            <Text style={styles.text}>Willkommen!</Text>
            <Text style={styles.text}>
              Nutze deine ILIAS-Zugangsdaten zur Anmeldung.
            </Text>
          </View>

          {/*Form fields*/}
          <View style={styles.formSectionContainer}>
            <InputController
                control={control}
                name="username"
                placeholder="Benutzername"
                errors={errors}
                backendError={backendError}
                leftIcon={
                  <Image
                      source={ICON.user}
                      tintColor={colors.label}
                      style={styles.inputIcon}
                      cachePolicy="memory-disk"
                  />
                }
                props={{
                  keyboardType: "default",
                  textContentType: "username",
                  autoCorrect: false,
                  autoCapitalize: "none",
                  returnKeyType: "next",
                  submitBehavior: "submit",
                  maxLength: 40,
                  onSubmitEditing: () => {
                    KeyboardController.setFocusTo("next");
                  },
                }}
            />
            <InputController
                control={control}
                name="password"
                placeholder="Passwort"
                errors={errors}
                backendError={backendError}
                leftIcon={
                  <TouchableOpacity
                      onPress={() => setShowPassword((prev) => !prev)}
                  >
                    <Image
                        source={!showPassword ? ICON.lock : ICON.unlock}
                        tintColor={colors.label}
                        style={styles.inputIcon}
                        cachePolicy="memory-disk"
                    />
                  </TouchableOpacity>
                }
                spacing={{
                  paddingBottom: ThemeSizes.Spacing.extraExtraSmall,
                }}
                props={{
                  //keyboardType: "visible-password",
                  secureTextEntry: !showPassword,
                  textContentType: "password",
                  autoCorrect: false,
                  autoCapitalize: "none",
                  returnKeyType: "done",
                  submitBehavior: "blurAndSubmit",
                  maxLength: 40,
                  onSubmitEditing: handleSubmit(handleLogin),
                }}
            />
            {/*Forgot Password Link*/}
            <View>
              <Text
                  style={[styles.textForgotPassword, styles.link]}
                  onPress={handleForgotPassword}
              >
                Passwort vergessen?
              </Text>
            </View>

            {/*Login Button*/}
            <SubmitButton title="Anmelden" onPress={handleSubmit(handleLogin)} spacing={{
              paddingTop: ThemeSizes.Spacing.extraLarge,
              paddingBottom: ThemeSizes.Spacing.extraLarge,
            }}/>
          </View>

          {/*Contact Us*/}
        </KeyboardAvoidingView>
        <View style={styles.supportSectionContainer}>
          <Text style={styles.textContact}>
            Keinen Account?{" "}
            <Text
                style={[styles.textContact, styles.link]}
                onPress={handleOpenContact}
            >
              Kontaktiere uns
            </Text>
          </Text>
        </View>

        {/*Legal Information*/}
        <View style={styles.legalInfoSection}>
          <TouchableOpacity onPress={openLegalPage} style={styles.legalInfoContainer}>
            <Image style={styles.legalInfoIcon} source={ICON.lock_shield} contentFit="contain"/>
          </TouchableOpacity>
        </View>
        {loading && <ActivityIndicator />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Page;

const dynamicStyles = (
  colors: Color,
  fontSize: FontSize,
  top: number,
  bottom: number,
) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingHorizontal: ThemeSizes.Spacing.horizontalDefault,
    },
    keyboardContainer: {
      flex: 1,
      justifyContent: "center",
      //backgroundColor: colors.green,
    },
    headerSectionContainer: {
      paddingBottom: ThemeSizes.Spacing.extraLarge,
    },
    formSectionContainer: {},
    supportSectionContainer: {
      //flex: 1,
      //backgroundColor: colors.red,
      position: "absolute",
      alignSelf: "center",
      bottom: bottom + 20,
    },
    legalInfoSection: {
      //paddingBottom: bottom,
    },
    logo: {
      width: "100%",
      height: 100,
      marginBottom: ThemeSizes.Spacing.extraLarge,
    },
    text: {
      color: colors.label,
      fontSize: fontSize.body,
      textAlign: "center",
      lineHeight: fontSize.subhead * 1.5,
    },
    textForgotPassword: {
      color: colors.label,
      fontSize: fontSize.footnote,
      textAlign: "right",
    },
    textContact: {
      color: colors.label,
      fontSize: fontSize.footnote,
      textAlign: "center",
    },
    link: {
      textDecorationLine: "underline",
    },
    inputIcon: {
      width: ThemeSizes.Sizes.icon,
      height: ThemeSizes.Sizes.icon,
    },
    legalInfoContainer: {
      backgroundColor: colors.secondary,
      borderRadius: "50%",
      //borderRadius: ThemeSizes.Radius.button,
      padding: 13,
      alignSelf: "flex-end",
      position: "absolute",
      bottom: bottom + 20,
    },
    legalInfoIcon: {
      width: 25,
      height: 25,
      tintColor: colors.label,
    },
  });
};
