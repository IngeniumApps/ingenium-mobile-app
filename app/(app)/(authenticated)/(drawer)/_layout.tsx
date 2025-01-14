import {Drawer} from "expo-router/drawer";

const DrawerLayout = () => {
    return (
        <Drawer>
            {/*
          (tabs) route contains the TabLayout with bottom navigation
          - Nested inside the drawer as the main content
          - headerShown: false removes double headers (drawer + tabs)
        */}
            <Drawer.Screen
                name="(tabs)"
                options={{
                    drawerLabel: "Home",
                }}
            />
            {/*
          Additional drawer routes can be added here
          - Each represents a screen accessible via the drawer menu
          - Will use the drawer header by default
        */}
            <Drawer.Screen
                name="settings"
                options={{
                    drawerLabel: "Einstellungen", // Label shown in drawer menu
                }}
            />
            <Drawer.Screen
                name="contact"
                options={{
                    drawerLabel: "Kontakt", // Label shown in drawer menu
                }}
            />
        </Drawer>
    )
}

export default DrawerLayout