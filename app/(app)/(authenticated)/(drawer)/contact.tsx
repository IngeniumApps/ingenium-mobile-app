import { StyleSheet, View, Text } from "react-native";
import BurgerMenu from "@/components/drawer/BurgerMenu";
import { ThemeSizes } from "@/constants/ThemeSizes";

const Page = () => {
  return (
    <View style={styles.container}>
      <BurgerMenu title={"Kontaktiere uns"} />
      <Text>Kontakt</Text>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ThemeSizes.Spacing.horizontalDefault,
  },
});
