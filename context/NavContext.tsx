import {createContext, ReactNode, useContext, useState} from 'react';

type NavContextType = {
    currentRoute: string;
    setCurrentRoute: (route: string) => void;
};

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
    const [currentRoute, setCurrentRoute] = useState<string>("");

    return (
        <NavContext.Provider value={{ currentRoute, setCurrentRoute }}>
            {children}
        </NavContext.Provider>
    );
}

export function useNavContext() {
    const context = useContext(NavContext);
    if (!context) throw new Error("useNavContext must be inside NavProvider");
    return context;
}