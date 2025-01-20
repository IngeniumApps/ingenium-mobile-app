import { Stack } from "expo-router";

const PublicLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="legal-modal/[type]"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default PublicLayout;
