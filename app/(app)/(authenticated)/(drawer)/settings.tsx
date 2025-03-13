import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import {Color, FontSize} from "@/types/theme";
import BurgerMenu from "@/components/drawer/BurgerMenu";
import { ThemeSizes } from "@/constants/ThemeSizes";
import Avatar from "@/components/Avatar";
import {useMemo, useState} from "react";
import TitelCardContainer from "@/components/cards/TitelCardContainer";
import {appStyles} from "@/constants/Styles";
import Card from "@/components/cards/Card";
import {ICON, IMAGE} from "@/constants/Images";
import RadioButton from "@/components/button/RadioButton";

const Page = () => {
  const { toggleTheme, colors, fontSize, changeFontSize, colorScheme } = useThemeStore();
  const styles = dynamicStyles(colors, fontSize);
  const defaultStyles = appStyles(fontSize, colors);
  const [isModalVisible, setModalVisible] = useState(false);
  let selectedId = colorScheme === "dark" ? "1" : "2";

  const handleFontSizeChange = (size: string) => {
    changeFontSize(size);
  };

  const radioButtons = useMemo(() => ([
    {
      id: "1",
      label: "Dunkel",
      value: "dark",
      image: IMAGE.darkMode
    },
    {
      id: '2',
      label: "Hell",
      value: "light",
      image: IMAGE.lightMode
    }
  ]), []);

  const toggleModal = () => {
    console.log("Toggle Modal")
    setModalVisible(!isModalVisible);
  };


  return (
    <View style={defaultStyles.container}>
      <BurgerMenu title={"Einstellungen"} />
      <View style={styles.profileContainer}>
        <Avatar/>
        <View>
          <Text style={[styles.text, styles.name]} numberOfLines={2}>Maximilian Constantin Mustermann-Zweinameextralang</Text>
        </View>
      </View>
      <TitelCardContainer title={"App-Erscheinungsbild"}>
        <View style={defaultStyles.descriptionContainer}>
          <Text style={defaultStyles.cardDescription}><Text style={defaultStyles.cardTitleDescription}>Dark
            Mode / Light
            Mode: </Text>
            Wechsle zwischen dem Dark Mode und Light Mode, um das Erscheinungsbild der App
            anzupassen.</Text>
        </View>
        <Card style={{
          justifyContent: "center",
        }}>
          <View style={styles.radioGroupContainer}>
            {radioButtons.map((button) => (
                <RadioButton
                    key={button.id}
                    button={button}
                    isSelected={selectedId === button.id}
                    onPress={toggleTheme}
                />

            ))}
          </View>
        </Card>
        <View style={defaultStyles.descriptionContainer}>
          <Text style={defaultStyles.cardDescription}><Text style={defaultStyles.cardTitleDescription}>Passe die Schriftgröße an: </Text>
            Wähle zwischen verschiedenen Textgrößen, um die Lesbarkeit der App nach deinen Bedürfnissen zu optimieren.</Text>
        </View>
        <Card image={ICON.text} label="Ändere Textgröße" onPress={toggleModal}
              clickable={true}/>
      </TitelCardContainer>
      <TouchableOpacity onPress={toggleTheme} style={styles.button}>
        <Text style={[styles.text, styles.buttonText]}>Toggle Theme</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleFontSizeChange("large_default")} style={styles.button}>
        <Text style={[styles.text, styles.buttonText]}>
          Change Font Size
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;

const dynamicStyles = (colors: Color, fontSize: FontSize) => {
  return StyleSheet.create({
    profileContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: ThemeSizes.Spacing.horizontalDefault,
      marginBottom: ThemeSizes.Spacing.fromHeader,
    },
    button: {
      backgroundColor: colors.accent,
      padding: 10,
      margin: 10,
      borderRadius: 5,
      textAlign: "center",
    },
    text: {
      color: colors.label,
      textAlign: "left",
      width: 230,
      fontSize: fontSize.body
    },
    name: {
      fontWeight: "600",
    },
    title: {

    },
    buttonText: {
      color: colors.lightNeutral,
    },
    radioGroupContainer: {
      flexDirection: "row",
      gap: 90,
    },
  });
};
