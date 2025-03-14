import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/drawer/CustomDrawerContent";
import useNavStore from "@/store/navStore";
import ActivityIndicator from "@/components/ActivityIndicatior";
import React from "react";
import useAuthStore from "@/store/authStore";

const DrawerLayout = () => {
  const { drawerEnabled } = useNavStore();
  const { loading } = useAuthStore();


  if (loading) {
      return  <ActivityIndicator />
  }

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
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
