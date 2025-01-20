import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Color, FontSize } from "@/types/themeTypes";
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
import { useState } from "react";
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
  const {
    login,
    error: backendError,
    loading,
  } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(zodSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "testi.mctest",
      password: "test123",
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

  const openLegalPage = (type: "impressum" | "privacy" | "terms") => {
    //router.push(`/legal-modal/${type}`);
    router.push("/legal-modal/impressum");
  };

  // handleSubmit is triggered when the validation is successful, otherwise it won't be called
  const handleLogin = async (data: FormData) => {
    try {
      await login(data.username, data.password);
    } catch (error) {
      console.error(" (login.tsx) - ❌ Fehler beim Login:", error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={20}
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

          {/*Login Button*/}
          <SubmitButton title="Anmelden" onPress={handleSubmit(handleLogin)} />
        </View>

        {/*Forgot Password and Contact Us*/}
        <View style={styles.supportSectionContainer}>
          <Text
            style={[styles.text, styles.link]}
            onPress={handleForgotPassword}
          >
            Passwort vergessen?
          </Text>
          <Text style={styles.text}>
            Keinen Account?{" "}
            <Text
              style={[styles.text, styles.link]}
              onPress={handleOpenContact}
            >
              Kontaktiere uns
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>

      {/*Legal Information*/}
      <View style={styles.legalInfoSection}>
        <Text style={[styles.text, styles.textCaption]}>
          Mit der Nutzung dieser App erklären Sie sich mit den{" "}
          <Text
            style={[styles.text, styles.textCaption, styles.link]}
            onPress={() => openLegalPage("privacy")}
          >
            Datenschutzrichtlinien
          </Text>{" "}
          und der{" "}
          <Text
            style={[styles.text, styles.textCaption, styles.link]}
            onPress={() => openLegalPage("terms")}
          >
            Nutzungsvereinbarung
          </Text>{" "}
          von Ingenium Education und ILIAS einverstanden.
        </Text>
        <Text style={[styles.text, styles.textCaption]}>
          Weitere rechtliche Informationen finden Sie in unserem{" "}
          <Text
            style={[styles.text, styles.textCaption, styles.link]}
            onPress={() => openLegalPage("impressum")}
          >
            Impressum
          </Text>
        </Text>
      </View>
      {loading && <ActivityIndicator />}
    </View>
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
    },
    headerSectionContainer: {
      paddingBottom: ThemeSizes.Spacing.extraLarge,
    },
    formSectionContainer: {},
    supportSectionContainer: {
      paddingTop: ThemeSizes.Spacing.verticalDefault,
    },
    legalInfoSection: {
      paddingBottom: bottom,
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
    },
    textCaption: {
      fontSize: fontSize.caption2,
    },
    link: {
      //color: colors.link,
      textDecorationLine: "underline",
    },
    inputIcon: {
      width: ThemeSizes.Sizes.icon,
      height: ThemeSizes.Sizes.icon,
    },
  });
};
