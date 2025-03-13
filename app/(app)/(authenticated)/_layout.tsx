import { Stack } from "expo-router";

const ProtectedLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        //headerTitle: "Stack (Protected) - Home",
      }}
    />
  );
};

export default ProtectedLayout;
