import {
  large_default,
  small,
  medium,
  xLarge,
  xxLarge,
  xSmall,
} from "@/constants/FontSizes";

/**
 * Defines the available themes for the application.
 *
 * @type {Theme}
 *
 * @property {"light"} light - Represents the light theme.
 * @property {"dark"} dark - Represents the dark theme.
 */
export type Theme = "light" | "dark";

/**
 * Defines the available font sizes based on predefined constants.
 *
 * @type {FontSize}
 *
 * FontSize can be one of the following:
 * - `large_default`: Default large font sizes, optimized for readability.
 * - `small`: Font sizes for small screens or compact layouts.
 * - `medium`: Font sizes for medium screens or balanced layouts.
 * - `xLarge`: Font sizes for extra-large screens or prominent UI elements.
 * - `xxLarge`: Font sizes for double extra-large screens or headings.
 * - `xSmall`: Font sizes for extra-small screens or minimal text.
 *
 * @example
 * // Example usage:
 * const fontSize: FontSize = large_default;
 * console.log(fontSize.body); // Output: 17 (example value)
 */
export type FontSize =
  | typeof xSmall
  | typeof small
  | typeof medium
  | typeof large_default
  | typeof xLarge
  | typeof xxLarge;

/**
 * A list of keys representing the available colors in the application.
 *
 * @type {ColorKeys}
 *
 * This type includes:
 * - Common colors such as `"red"`, `"orange"`, `"blue"`.
 * - Theme-specific colors like `"darkNeutral"` or `"lightNeutral"`.
 * - Utility colors such as `"placeholderText"` or `"separator"`.
 *
 * These keys are used throughout the application to ensure consistency in theming and branding.
 *
 * @example
 * // Example usage:
 * const exampleKey: ColorKeys = "red";
 */
type ColorKeys =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "mint"
  | "teal"
  | "cyan"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "brown"
  | "gray"
  | "gray_2"
  | "gray_3"
  | "gray_4"
  | "gray_5"
  | "gray_6"
  | "accent"
  | "black"
  | "white"
  | "primary"
  | "secondary"
  | "secondaryTransparent"
  | "label"
  | "secondaryLabel"
  | "tertiaryLabel"
  | "quaternaryLabel"
  | "placeholderText"
  | "separator"
  | "opaqueSeparator"
  | "link"
  | "darkNeutral"
  | "lightNeutral";

/**
 * Represents a collection of color values used in the application.
 *
 * @type {Colors}
 *
 * This type maps each key from `ColorKeys` to a string value that represents
 * a color code (e.g., hex value, RGB string).
 *
 * Additionally, it includes extra fields for customization:
 * - `baseColor`: Represents the primary color of the application.
 * - `colorButtonLabel` (optional): Represents the color of button labels, which may vary based on contrast requirements.
 *
 * @example
 * // Example usage:
 * const myColors: Colors = {
 *   primary: "#ff0000",           // Red for primary elements
 *   baseColor: "#123456",         // Custom primary color
 *   colorButtonLabel: "#ffffff",  // Button label color
 *   // Other colors from ColorKeys...
 * };
 */
type BaseColor = {
  [key in ColorKeys]: string; // All keys from ColorKeys are mapped to strings
};

type ExtraFields = {
  baseColor: string; // The main color of the application
  colorButtonLabel?: string; // Optional color for button labels
};

//export type Colors = BaseColor & ExtraFields;
export type Color = BaseColor;
