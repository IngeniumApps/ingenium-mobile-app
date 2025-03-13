import { Color, FontSize, Theme } from "@/types/theme";
import { xSmall, small, medium, large_default, xLarge, xxLarge } from "@/constants/FontSizes";
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
        set((state) => {
          const updatedScheme =
            state.colorScheme === "light" ? "dark" : "light";
          const updatedColors =
            updatedScheme === "dark" ? darkColors : lightColors;

          return {
            colorScheme: updatedScheme,
            colors: updatedColors,
          };
        });
      },
      changeFontSize: (size: string) => {
          let newFontSize;

          switch (size) {
              case "xSmall":
                  newFontSize = xSmall;
                  break;
              case "small":
                  newFontSize = small;
                  break;
              case "medium":
                  newFontSize = medium;
                  break;
              case "xLarge":
                  newFontSize = xLarge;
                  break;
              case "xxLarge":
                  newFontSize = xxLarge;
                  break;
              default:
                  newFontSize = large_default;
          }

          set({ fontSize: newFontSize });
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
