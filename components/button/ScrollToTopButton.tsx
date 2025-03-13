import {StyleSheet,TouchableOpacity} from 'react-native'
import {Image} from "expo-image";
import Animated from "react-native-reanimated";
import {useThemeStore} from "@/store/themeStore";
import {ICON} from "@/constants/Images";
import {Color} from "@/types/theme";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface ScrollToTopButtonProps {
    buttonStyle: any;
    onPress: () => void;
}
/**
 * ScrollToTopButton is a reusable component that displays a button to scroll to the top of the screen.
 * The button is animated and can be customized with different styles and actions.
 *
 * @param {ScrollToTopButtonProps} props - The properties for configuring the ScrollToTopButton component.
 * @param {any} props.buttonStyle - The animated style applied to the button, typically used to control visibility.
 * @param {() => void} props.onPress - The function to call when the button is pressed.
 *
 * @example
 * <ScrollToTopButton
 *    buttonStyle={animatedStyle}
 *    onPress={() => scrollToTop()}
 * />
 */
const ScrollToTopButton = ({buttonStyle, onPress}:ScrollToTopButtonProps) => {
    const {colors} = useThemeStore();
    const insets = useSafeAreaInsets();
    const styles = dynamicStyles(colors);

    return (
        <Animated.View style={[buttonStyle, styles.container, {bottom: insets.bottom}]}>
            <TouchableOpacity onPress={onPress}>
                <Image style={styles.image} source={ICON.up}/>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default ScrollToTopButton

const dynamicStyles = (colors: Color) => {
    return StyleSheet.create({
        container: {
            position: 'absolute',
            //bottom: 60,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: 30,
            backgroundColor: colors.accent,
            justifyContent: 'center',
            alignItems: 'center',
        },
        image: {
            width: 30,
            height: 30,
            tintColor: colors.lightNeutral,
        }
    })
}