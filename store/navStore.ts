import {create} from "zustand";

interface NavState {
    currentRoute: string;
    drawerEnabled: boolean;
    notificationCount: number;
}

interface NavActions {
    setCurrentRoute: (route: string) => void;
    setDrawerEnabled: (enabled: boolean) => void;
    updateNotificationCount: (count: number) => void;

}

const useNavStore = create<NavState & NavActions>((set, get) => ({
    currentRoute: "Dashboard_Tab",
    drawerEnabled: true,
    notificationCount: 0,

    //setCurrentRoute: (route: string) => set({ currentRoute: route }),
    setCurrentRoute: (route: string) =>
        set((state) => (state.currentRoute !== route ? { currentRoute: route } : state)),
    setDrawerEnabled: (enabled: boolean) => set({ drawerEnabled: enabled }),
    updateNotificationCount: (count: number) => set({ notificationCount: count }),
}));

export default useNavStore;