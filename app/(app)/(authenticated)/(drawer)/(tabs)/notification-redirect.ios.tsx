import {Redirect} from "expo-router";

/**
 * Only works on iOS.
 */

const Page = () => {
    return (
        <Redirect href="/(app)/(authenticated)/(drawer)/(tabs)/tasks/notification" />
    );
};

export default Page;
