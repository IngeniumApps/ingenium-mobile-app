import { StyleSheet, View, Text } from "react-native";
import { useRouter } from "expo-router";
import useAuthStore from "@/store/authStore";

const Page = () => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <Text>HOME</Text>
      <Text onPress={handleLogout}>Sign Out</Text>
    </View>
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
