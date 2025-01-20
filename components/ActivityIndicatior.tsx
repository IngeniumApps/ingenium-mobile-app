import { ActivityIndicator as Indicator, StyleSheet, View } from "react-native";
import { useThemeStore } from "@/store/themeStore";
/**
 * Displays a customizable activity indicator with an overlay.
 *
 * **Purpose:**
 * - Shows a loading spinner on top of the screen when the app is performing a background operation.
 * - Provides a semi-transparent overlay to focus user attention on the loading state.
 *
 * **How it works:**
 * - The component uses `StyleSheet.absoluteFillObject` to ensure the overlay spans the entire screen.
 *
 * **Usage:**
 * - Include this component in your app to show a loading spinner during async operations like API calls or authentication.
 * - Typically conditionally rendered when `loading` is true in the app's state.
 *
 * @example
 * ```tsx
 * {loading && <ActivityIndicator />}
 * ```
 */
const ActivityIndicator = () => {
  const { colors } = useThemeStore();

  return (
    <View style={styles.loadingOverlay}>
      <Indicator size="large" color={colors.label} />
    </View>
  );
};

export default ActivityIndicator;

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});
