import {Redirect, useFocusEffect, useRouter} from "expo-router";
import {Platform} from "react-native";
import {useCallback, useEffect, useState} from "react";

/**
 * TODO: Verify if the redirect works correctly on Android.
 *
 * Android HACK: Using <Redirect href="/(app)/(authenticated)/(drawer)/(tabs)/tasks/notification" />
 * directly in the router does not work on Android. Currently, the redirect only functions properly on iOS.
 *
 * On Android, the following error appears: "Unable to find viewState for tag 84. Surface stopped."
 *
 * The issue is that when using router.replace() instead, the segment structure does not update correctly!
 * To ensure the navigation works correct, the following structure is required:
 *
 * segment[0]: (app)
 * segment[1]: (authenticated)
 * segment[2]: (drawer)
 * segment[3]: (tabs)
 * segment[4]: tasks
 * segment[5]: notification
 *
 * This is a hack with platform-specific code to ensure the correct segment structure. The performance is not optimal on android.
 */

const Page = () => {
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                router.replace("/(app)/(authenticated)/(drawer)/(tabs)/tasks/notification");
            }, 0);
        }, [])
    );

    return null; // Kein UI, nur Redirect-Logik
};

export default Page;
