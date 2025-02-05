import { Color, FontSize, Theme } from "@/types/theme";
import { large_default } from "@/constants/FontSizes";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { darkColors, lightColors } from "@/constants/Colors";

type ThemeState = {
  colorScheme: Theme;
  colors: Color;
  fontSize: FontSize;
};

type ThemeActions = {
  toggleTheme: () => void;
  changeFontSize: (size: string) => void;
};

const INITIAL_STATE: ThemeState = {
  colorScheme: "light",
  colors: lightColors,
  fontSize: large_default,
};

export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      toggleTheme: () => {
        const { colorScheme } = get();
        const updatedScheme = colorScheme === "light" ? "dark" : "light";
        const updatedColors =
          colorScheme === "light" ? lightColors : darkColors;

        set({
          colorScheme: updatedScheme,
          colors: updatedColors,
        });
      },
      changeFontSize: (size: string) => {},
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
