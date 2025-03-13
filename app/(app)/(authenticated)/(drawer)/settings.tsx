import {StyleSheet, View, Text, ScrollView, Linking} from "react-native";
import {useThemeStore} from "@/store/themeStore";
import {Color, FontSize} from "@/types/theme";
import BurgerMenu from "@/components/drawer/BurgerMenu";
import {ThemeSizes} from "@/constants/ThemeSizes";
import Avatar from "@/components/Avatar";
import {useMemo, useRef, useState} from "react";
import TitelCardContainer from "@/components/cards/TitelCardContainer";
import {appStyles} from "@/constants/Styles";
import Card from "@/components/cards/Card";
import {ICON, IMAGE} from "@/constants/Images";
import RadioButton from "@/components/button/RadioButton";
import {Picker} from '@react-native-picker/picker';
import CustomModal from "@/components/modal/CustomModal";
import ScrollToTopButton from "@/components/button/ScrollToTopButton";
import Animated, {useAnimatedRef, useAnimatedStyle, useScrollViewOffset, withTiming} from "react-native-reanimated";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const Page = () => {
    const {toggleTheme, colors, fontSize, changeFontSize, colorScheme} = useThemeStore();
    const styles = dynamicStyles(colors, fontSize);
    const defaultStyles = appStyles(fontSize, colors);
    const [isModalVisible, setModalVisible] = useState(false);
    let selectedId = colorScheme === "dark" ? "1" : "2";
    const [selectedFontsize, setSelectedFontsize] = useState("large_default");
    const insets = useSafeAreaInsets();

    const [isNotificationsEnabled_1, setIsNotificationsEnabled_1] = useState(true);
    const [isNotificationsEnabled_2, setIsNotificationsEnabled_2] = useState(true);
    const [isNotificationsEnabled_3, setIsNotificationsEnabled_3] = useState(true);

    const handleSwitchToggle_1 = (value: boolean) => {
        setIsNotificationsEnabled_1(value);
        console.log("Benachrichtigungen aktiviert:", value);
    };
    const handleSwitchToggle_2 = (value: boolean) => {
        setIsNotificationsEnabled_2(value);
        console.log("Benachrichtigungen aktiviert:", value);
    };
    const handleSwitchToggle_3 = (value: boolean) => {
        setIsNotificationsEnabled_3(value);
        console.log("Benachrichtigungen aktiviert:", value);
    };

    const iCalUrl = "https://ilias2.ingenium.co.at/calendar.php?client_id=ingenium&token=af68c563718004ae8395de22074658f3&limited=0";

    // ScrollView Ref für das Hochscrollen
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollHandler = useScrollViewOffset(scrollRef);

    // Animierter Button (wird eingeblendet, wenn nach unten gescrollt wird)
    const buttonStyle = useAnimatedStyle(() => ({
        opacity: scrollHandler.value > 100 ? withTiming(1) : withTiming(0),
    }));

    const scrollToTop = () => {
        scrollRef.current?.scrollTo({x: 0, y: 0, animated: true});
    };

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
            <BurgerMenu title={"Einstellungen"}/>
            <ScrollView ref={scrollRef}
                        showsVerticalScrollIndicator={false}
                        bounces={true}
                //contentContainerStyle={{ paddingBottom: 0, backgroundColor: "yellow" }}
                        style={{
                            marginBottom: insets.bottom
                        }}
            >
                <View style={styles.profileContainer}>
                    <Avatar/>
                    <View>
                        <Text style={[styles.text, styles.name]} numberOfLines={2}>Maximilian Constantin
                            Mustermann-Zweinameextralang</Text>
                    </View>
                </View>

                <TitelCardContainer title={"Persönliche Einstellungen"}>
                    <Card image={ICON.contact_active}
                          label="Kontodetails"
                          navigateTo={"test"}
                          clickable={true}/>
                </TitelCardContainer>
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
                        <Text style={defaultStyles.cardDescription}><Text style={defaultStyles.cardTitleDescription}>Passe
                            die Schriftgröße an: </Text>
                            Wähle zwischen verschiedenen Textgrößen, um die Lesbarkeit der App nach deinen Bedürfnissen
                            zu optimieren.</Text>
                    </View>
                    <Card image={ICON.text} label="Schriftgröße anpassen" onPress={toggleModal}
                          clickable={true}/>
                </TitelCardContainer>

                <CustomModal isVisible={isModalVisible} onClose={toggleModal}>
                    <Text style={styles.modalText}>Wähle deine gewünschte Textgröße aus:</Text>
                    <Picker selectedValue={selectedFontsize}
                            itemStyle={styles.pickerItem}
                            onValueChange={(itemValue) => {
                                setSelectedFontsize(itemValue);
                                handleFontSizeChange(itemValue);
                            }}
                    >
                        <Picker.Item label="Sehr klein" value="xSmall"/>
                        <Picker.Item label="Klein" value="small"/>
                        <Picker.Item label="Medium" value="medium"/>
                        <Picker.Item label="Standard" value="large_default"/>
                        <Picker.Item label="Sehr groß" value="xLarge"/>
                        <Picker.Item label="Extra groß" value="xxLarge"/>
                    </Picker>
                </CustomModal>

                <TitelCardContainer title={"Benachrichtigungen & Erinnerungen"}>
                    <View style={defaultStyles.descriptionContainer}>
                        <Text style={defaultStyles.cardDescription}>
                            Bleibe immer auf dem Laufenden! Aktiviere Push-Benachrichtigungen für wichtige Updates, Erinnerungen und Mitteilungen zu deinem Konto.</Text>
                    </View>
                    <Card label="Push-Benachrichtigungen #1"
                          hasSwitch={true}
                          switchValue={isNotificationsEnabled_1}
                          thumbColor={isNotificationsEnabled_1}
                          onSwitchValueChange={handleSwitchToggle_1}
                          onPress={() => console.log("Stelle Benachrichtigungen ein")}/>
                    <Card label="Push-Benachrichtigungen #2"
                          hasSwitch={true}
                          switchValue={isNotificationsEnabled_2}
                          thumbColor={isNotificationsEnabled_2}
                          onSwitchValueChange={handleSwitchToggle_2}
                          onPress={() => console.log("Stelle Benachrichtigungen ein")}/>
                    <Card label="Push-Benachrichtigungen #3"
                          hasSwitch={true}
                          switchValue={isNotificationsEnabled_3}
                          thumbColor={isNotificationsEnabled_3}
                          onSwitchValueChange={handleSwitchToggle_3}
                          onPress={() => console.log("Stelle Benachrichtigungen ein")}/>
                </TitelCardContainer>


                <TitelCardContainer title={"Kalender & Termine"}>
                    <View style={defaultStyles.descriptionContainer}>
                        <Text style={defaultStyles.cardDescription}>Du kannst folgende ICal-URL kopieren und in Kalender einfügen welche das ICal Format
                            unterstützen, um deinen Stundenplan in deinen privaten Kalender zu integrieren.</Text>
                    </View>
                    <Card image={ICON.copy}
                          label="https://ilias2.ingenium.co.at/calendar.php?client_id=ingenium&token=af68c563718004ae8395de22074658f3&limited=0"
                          onPress={() => Linking.openURL(iCalUrl)}
                          clickable={true}/>
                </TitelCardContainer>
            </ScrollView>
            <ScrollToTopButton onPress={scrollToTop} buttonStyle={buttonStyle}/>
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
        title: {},
        buttonText: {
            color: colors.lightNeutral,
        },
        radioGroupContainer: {
            flexDirection: "row",
            gap: 90,
        },
        modalText: {
            fontSize: fontSize.body,
            textAlign: "center",
            color: colors.label
        },
        pickerItem: {
            color: colors.label,
            fontSize: fontSize.title2,
        }
    });
};
