import {Modal, TouchableOpacity, StyleSheet, Text, TouchableWithoutFeedback} from "react-native";
import {ReactNode} from "react";
import {useThemeStore} from "@/store/themeStore";
import {Color, FontSize} from "@/types/theme";
import {ThemeSizes} from "@/constants/ThemeSizes";

interface CustomModalProps {
    isVisible: boolean;
    onClose: () => void;
    onCloseLabel?: string;
    children: ReactNode;
}
/**
 * CustomModal is a reusable component that displays a modal with customizable content and a close button.
 * The modal can be configured to show or hide based on the isVisible prop, and it includes a close button
 * with a customizable label.
 *
 * @param {CustomModalProps} props - The properties for configuring the CustomModal component.
 * @param {boolean} props.isVisible - Controls whether the modal is visible or not.
 * @param {() => void} props.onClose - Function to call when the modal is closed.
 * @param {string} [props.onCloseLabel="Schließen"] - Optional: The label for the close button. Defaults to "Schließen".
 * @param {ReactNode} props.children - The content to be displayed inside the modal.
 *
 * @example
 * <CustomModal isVisible={true} onClose={() => console.log('Modal closed')}>
 *    <Text>Modal Content</Text>
 * </CustomModal>
 */
const CustomModal = ({onCloseLabel = "Schließen", ...props}: CustomModalProps) => {
    const {colors, fontSize} = useThemeStore();
    const styles = dynamicStyles(colors, fontSize);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.isVisible}
            onRequestClose={props.onClose}
        >
            <TouchableOpacity style={styles.modalContainer} onPress={props.onClose} activeOpacity={1}>
                <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
                    {props.children}
                    <TouchableWithoutFeedback onPress={props.onClose}>
                        <Text style={styles.button}>{onCloseLabel}</Text>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default CustomModal;

const dynamicStyles = (colors: Color, fontSize: FontSize) => StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: colors.secondaryLabel
    },
    modalContent: {
        width: "100%",
        padding: 20,
        backgroundColor: colors.secondary,
        borderTopLeftRadius: ThemeSizes.Radius.modal,
        borderTopRightRadius: ThemeSizes.Radius.modal,
    },
    pickerItem: {
        color: colors.label,
        fontSize: fontSize.title2,
    },
    button: {
        color: colors.accent,
        fontSize: fontSize.title3,
        padding: 10,
        margin: 10,
        textAlign: "center",
        fontWeight: "600"
    }
});