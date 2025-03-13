import {StyleSheet, View, TouchableOpacity} from 'react-native'
import {Image} from "expo-image";
import {useThemeStore} from "@/store/themeStore";
import {ICON} from "@/constants/Images";

/**
 * TODO: Add Avatar as Text e.g. MM for Max Mustermann, also add select image functionality to account settings hook
 */

interface AvatarProps {
    radius?: number
    pressable?: boolean
    isCameraIconVisible?: boolean
}

const Avatar = ({
                    radius = 100,
                    pressable = false,
                    isCameraIconVisible = true
                }: AvatarProps) => {
    const {colors} = useThemeStore();

    return (
        <TouchableOpacity disabled={pressable}>
            <View style={[styles.imageContainer, {
                width: radius,
                height: radius,
            }]}>
                <Image source={{uri: "https://i.pravatar.cc/300"}}
                       style={{
                           width: radius,
                           height: radius,
                           borderRadius: radius / 2,
                           //tintColor: isAvatarImage ? colors.baseColor : undefined, // Wende tintColor nur an, wenn es sich um "avatar.png" handelt
                       }}
                       contentFit={"cover"}
                       cachePolicy={"memory-disk"}
                />
                {isCameraIconVisible && (
                    <View style={styles.camera}>
                        <Image source={ICON.camera} style={{
                            width: radius / 4,
                            height: radius / 4,
                            tintColor: colors.label
                        }}/>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    )
}

export default Avatar

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: "flex-end",
    },
    camera: {
        flex: 1,
        justifyContent: "flex-end",
    },
})