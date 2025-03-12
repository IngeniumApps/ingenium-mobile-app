import {StyleSheet, View, Text, Button} from 'react-native'
import {useRouter, useSegments} from "expo-router";

const Page = () => {

    const router = useRouter();
    const segments = useSegments();

    // @ts-ignore
    const isFromTasks = segments.includes("tasks"); // Prüft, ob Tasks im Stack ist



    return (
        <>
            <View style={styles.container}>
                <Text>Notification Screen TEST</Text>
                {isFromTasks && <Button title="Zurück zu Aufgaben" onPress={() => router.back()}/>}
            </View>
        </>
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})