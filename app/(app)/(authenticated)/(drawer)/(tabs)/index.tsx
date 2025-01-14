import {StyleSheet, View, Text} from 'react-native'
import {useRouter} from "expo-router";

const Page = () => {
    const router = useRouter()

    return (
        <View style={styles.container}>
            <Text>HOME</Text>
            <Text
                onPress={() => {
                    router.replace("/login");
                }}>
                Sign Out
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