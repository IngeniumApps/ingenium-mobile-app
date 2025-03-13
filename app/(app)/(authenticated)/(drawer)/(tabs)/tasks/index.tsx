import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import BurgerMenu from "@/components/drawer/BurgerMenu";
import { ThemeSizes } from "@/constants/ThemeSizes";

const Page = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <BurgerMenu title="Aufgaben" />
      <Text>Aufgaben</Text>
      <TouchableOpacity
        onPress={() =>
          router.push(
            "/(app)/(authenticated)/(drawer)/(tabs)/tasks/notification",
          )
        }
      >
        <Text>Weiter zu Mitteilung</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ThemeSizes.Spacing.horizontalDefault,
  },
});
