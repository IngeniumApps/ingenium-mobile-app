import {StyleSheet, View, Text} from 'react-native'
import {useRouter} from "expo-router";

const Page = () => {
    const router = useRouter()

    return (
        <View style={styles.container}>
            <Text
                onPress={() => {
                    // Navigate after signing in. You may want to tweak this to ensure sign-in is
                    // successful before navigating.
                    router.replace("/");
                }}>
                Sign In
            </Text>
            <Text
                onPress={() => {
                    router.push("/legal-modal/impressum");
                }}
            >
                Open Modal
            </Text>
        </View>
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})