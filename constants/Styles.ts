import { StyleSheet } from 'react-native';
import {Color, FontSize} from "@/types/theme";
import {ThemeSizes} from "@/constants/ThemeSizes";

export const appStyles = (fontSize: FontSize, colors: Color) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
            paddingHorizontal: ThemeSizes.Spacing.horizontalDefault,
        },
        cardDescription: {
            fontSize: fontSize.subhead,
            fontWeight: "300",
            color: colors.label,
        },
        cartTitle: {
            fontSize: fontSize.title3,
            fontWeight: "600",
            color: colors.label,
        },
        cardTitleDescription: {
            fontSize: fontSize.subhead,
            fontWeight: "600",
            color: colors.accent,
        },
        descriptionContainer: {
            marginBottom: ThemeSizes.Spacing.titleSpacingBottom
        },
        headerTitle: {
            flex: 1,
            textAlign: "right",
            fontSize: fontSize.title1,
            fontWeight: "600",
            color: colors.label,
        },
        separator: {
            //height: StyleSheet.hairlineWidth,
        },
    });
};