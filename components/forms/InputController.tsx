import {
  StyleSheet,
  View,
  Text,
  TextInputProps,
  TextInput,
} from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { ReactNode, useState } from "react";
import { useThemeStore } from "@/store/themeStore";
import {Color, FontSize, SpacingProps} from "@/types/theme";
import { FormData } from "@/utils/validation";
import { ThemeSizes } from "@/constants/ThemeSizes";

interface InputControllerProps {
  control: Control<FormData>;
  errors?: FieldErrors<FormData>;
  backendError?: string | null;
  name: keyof FormData;
  placeholder: string;
  leftIcon?: ReactNode;
  spacing?: SpacingProps;
  props?: TextInputProps;
}

const InputController = ({
  control,
  errors,
  backendError,
  name,
  placeholder,
  leftIcon,
  spacing,
  props,
}: InputControllerProps) => {
  const { colorScheme, colors, fontSize } = useThemeStore();
  const styles = dynamicStyles(colors, fontSize);
  const [isFocused, setIsFocused] = useState(false);

  const errorMessage = errors?.[name]?.message || backendError;

  const containerBorder = errorMessage
    ? styles.errorOutlined
    : isFocused
      ? styles.selectedOutlined
      : styles.outlined;

  // const containerBorder =
  //     errors && errors[name] ? styles.errorOutlined :
  //         isFocused ? styles.selectedOutlined : styles.outlined;

  return (
    <View style={[styles.container, spacing]}>
      {errorMessage && <Text style={styles.textError}>{errorMessage}</Text>}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.inputWrapper, containerBorder]}>
            {leftIcon}
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor={colors.placeholderText}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
              onFocus={() => setIsFocused(true)}
              onChangeText={onChange}
              value={value}
              selectionColor={colors.accent}
              keyboardAppearance={colorScheme === "light" ? "light" : "dark"}
              {...props}
            />
          </View>
        )}
      />
    </View>
  );
};

export default InputController;

const dynamicStyles = (colors: Color, fontSizes: FontSize) => {
  return StyleSheet.create({
    container: {
      paddingBottom: ThemeSizes.Spacing.horizontalDefault,
    },
    inputWrapper: {
      flexDirection: "row",
      height: ThemeSizes.Sizes.inputHeight,
      backgroundColor: colors.secondary,
      alignItems: "center",
      gap: ThemeSizes.Spacing.horizontalDefault,
      paddingHorizontal: ThemeSizes.Spacing.horizontalDefault,
    },
    input: {
      flex: 1,
      color: colors.label,
      fontSize: fontSizes.body,
    },
    outlined: {
      borderWidth: 1,
      borderColor: "transparent",
      borderRadius: ThemeSizes.Radius.input,
    },
    selectedOutlined: {
      borderWidth: 1,
      borderColor: colors.accent,
      borderRadius: ThemeSizes.Radius.input,
    },
    errorOutlined: {
      borderWidth: 1,
      borderColor: colors.red,
      borderRadius: ThemeSizes.Radius.input,
    },
    textError: {
      color: colors.red,
      fontSize: fontSizes.caption2,
      marginBottom: 5,
    },
  });
};
