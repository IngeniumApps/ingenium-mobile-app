import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="timetable"
        options={{
          tabBarLabel: "Stundenplan",
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          tabBarLabel: "Mitteilung",
          tabBarBadge: 3,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
