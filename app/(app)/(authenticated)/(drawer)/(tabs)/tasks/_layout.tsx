import { router, Stack } from "expo-router";
import useNavStore from "@/store/navStore";
import { Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { ICON } from "@/constants/Images";
import { ThemeSizes } from "@/constants/ThemeSizes";
import { useThemeStore } from "@/store/themeStore";

export default function TasksLayout() {
  const { setDrawerEnabled } = useNavStore();
  const { colors, fontSize } = useThemeStore();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.primary,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          // little hack to disable swipe gesture and disable back button
          headerLeft: () => <></>,
          gestureEnabled: false,
          // hack to show pop animation in navigation coming from notification screen
          animationTypeForReplace: "pop",
          headerShown: false,
        }}
        listeners={{
          focus: () => setDrawerEnabled(true),
        }}
      />
      <Stack.Screen
        name="notification"
        options={{
          title: "",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace("/tasks")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: ThemeSizes.Spacing.horizontalExtraSmall,
              }}
            >
              <Image
                source={ICON.back}
                style={{
                  width: ThemeSizes.Sizes.icon,
                  height: ThemeSizes.Sizes.icon,
                }}
              />
              <Text
                style={{
                  fontSize: fontSize.body,
                }}
              >
                Zurück
              </Text>
            </TouchableOpacity>
          ),
        }}
        listeners={{
          focus: () => setDrawerEnabled(false),
        }}
      />
    </Stack>
  );
}
