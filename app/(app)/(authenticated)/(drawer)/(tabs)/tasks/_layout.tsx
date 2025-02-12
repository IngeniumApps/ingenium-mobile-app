import { Stack } from "expo-router";
import useNavStore from "@/store/navStore";

export default function TasksLayout() {
    const {setDrawerEnabled} = useNavStore();

    return (
        <Stack screenOptions={{
            headerShown: true,
        }}>
            <Stack.Screen name="index" listeners={{
                focus: () => setDrawerEnabled(true),
            }}/>
            <Stack.Screen name="notification" listeners={{
                focus: () => setDrawerEnabled(false),
            }}/>
        </Stack>
    );
}
