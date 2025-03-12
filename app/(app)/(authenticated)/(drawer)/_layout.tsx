import {Drawer} from "expo-router/drawer";
import CustomDrawerContent from "@/components/drawer/CustomDrawerContent";
import useNavStore from "@/store/navStore";

const DrawerLayout = () => {
    const {drawerEnabled} = useNavStore();

    return (
            <Drawer drawerContent={CustomDrawerContent}
                    screenOptions={{
                        drawerHideStatusBarOnOpen: true,
                        headerShown: false,
                        //headerTitle: "(Drawer) - Home",
                        swipeEnabled: drawerEnabled,
                    }}
            />
    );
};

export default DrawerLayout;
