import {StyleSheet, View, Text} from 'react-native';
import {ReactNode, useMemo} from "react";
import {useThemeStore} from "@/store/themeStore";
import {appStyles} from "@/constants/Styles";
import {ThemeSizes} from "@/constants/ThemeSizes";

interface TitleCardContainerProps {
    /**
     * The title text displayed at the top of the container.
     */
    title: string;
    /**
     * The content to be displayed below the title.
     */
    children: ReactNode;
}

/**
 * `TitleCardContainer` is a reusable component that displays a title followed by its children content.
 * The component applies dynamic styles based on the current theme's font sizes and colors,
 * which are provided by the `useThemeStore` context.
 *
 * @param {TitleCardContainerProps} props - The properties for configuring the TitleCardContainer component.
 *
 * @example
 * <TitleCardContainer title="Section Title">
 *    <Text>Content goes here</Text>
 * </TitleCardContainer>
 */
const TitleCardContainer = ({title, children}: TitleCardContainerProps) => {
    const {fontSize, colors} = useThemeStore();
    // Memoized styles to improve performance
    const defaultStyles = useMemo(() => appStyles(fontSize, colors), [fontSize, colors]);

    return (
        <>
            <View style={styles.spacing}>
                <Text style={defaultStyles.cartTitle}>{title}</Text>
            </View>
            {children}
        </>
    );
}

export default TitleCardContainer;

/**
 * Styles for the TitleCardContainer component.
 */
const styles = StyleSheet.create({
    spacing: {
        marginVertical: ThemeSizes.Spacing.verticalSmall,
    },
});