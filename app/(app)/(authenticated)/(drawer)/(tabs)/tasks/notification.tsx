import { StyleSheet, View, Text, Button } from "react-native";
import { useRouter, useSegments } from "expo-router";

const Page = () => {

  return (
    <>
      <View style={styles.container}>
        <Text>Notification Screen TEST</Text>
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
