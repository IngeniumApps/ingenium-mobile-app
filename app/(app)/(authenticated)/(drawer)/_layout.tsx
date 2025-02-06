import {Drawer} from "expo-router/drawer";
import React from "react";
import CustomDrawerContent from "@/components/drawer/CustomDrawerContent";

const DrawerLayout = () => {
    return (
            <Drawer drawerContent={CustomDrawerContent}
                    screenOptions={{
                        drawerHideStatusBarOnOpen: true,
                        headerShown: false,
                    }}
            />
    );
};

export default DrawerLayout;
