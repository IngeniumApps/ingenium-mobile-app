import { ICON } from "@/constants/Images";

export const topItems = [
  {
    route: "(tabs)",
    label: "Dashboard",
    iconActive: ICON.dashboard_active,
    iconInactive: ICON.dashboard_inactive,
  },
  {
    route: "(tabs)/timetable",
    label: "Stundenplan",
    iconActive: ICON.timetable_active,
    iconInactive: ICON.timetable_inactive,
  },
  {
    route: "(tabs)/tasks",
    //no focus on tab
    label: "Aufgaben",
    iconActive: ICON.tasks,
    iconInactive: ICON.tasks,
  },
  {
    route: "settings",
    label: "Einstellungen",
    iconActive: ICON.settings_active,
    iconInactive: ICON.settings_inactive,
  },
];

export const externalLinks = [
  {
    route: "https://ilias.ingenium.co.at",
    label: "ILIAS",
    iconActive: ICON.web,
    iconInactive: ICON.web,
  },
  {
    route: "https://www.ingenium.co.at",
    label: "Ingenium Education",
    iconActive: ICON.web,
    iconInactive: ICON.web,
  },
  /*    {name: "https://test1.at", label: "Test1", iconActive: ICON.web, iconInactive: ICON.web},
    {name: "https://test2.at", label: "Test2", iconActive: ICON.web, iconInactive: ICON.web},
    {name: "https://test3.at", label: "Test3", iconActive: ICON.web, iconInactive: ICON.web},
    {name: "https://test4.at", label: "Test4", iconActive: ICON.web, iconInactive: ICON.web},
    {name: "https://test5.at", label: "Test5", iconActive: ICON.web, iconInactive: ICON.web},
    {name: "https://test6.at", label: "Test6", iconActive: ICON.web, iconInactive: ICON.web},
    {name: "https://test7.at", label: "Test7", iconActive: ICON.web, iconInactive: ICON.web},
    {name: "https://test8.at", label: "Test8", iconActive: ICON.web, iconInactive: ICON.web},
    {name: "https://test9.at", label: "Test9", iconActive: ICON.web, iconInactive: ICON.web},
    {name: "https://test10.at", label: "Test10", iconActive: ICON.web, iconInactive: ICON.web},
    {name: "https://test11.at", label: "Test11", iconActive: ICON.web, iconInactive: ICON.web},
    {name: "https://test12.at", label: "Test12", iconActive: ICON.web, iconInactive: ICON.web},
    {name: "https://test13.at", label: "Test13", iconActive: ICON.web, iconInactive: ICON.web},
    {name: "https://test14.at", label: "Test14", iconActive: ICON.web, iconInactive: ICON.web},
    {name: "https://test15.at", label: "Test15", iconActive: ICON.web, iconInactive: ICON.web},*/
];

export const bottomItems = [
  {
    route: "contact",
    label: "Kontakt",
    iconActive: ICON.contact_active,
    iconInactive: ICON.contact_inactive,
  },
  {
    route: "Logout",
    label: "Abmelden",
    iconActive: ICON.logout,
    iconInactive: ICON.logout,
  },
];
