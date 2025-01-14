import {router, Slot, useSegments} from "expo-router";
import {useEffect, useState} from "react";

const AppLayout = () => {
    const [session, setSession] = useState(false); // fake session state
    const [isMounted, setIsMounted] = useState(false); // initial fake state of mounted is false
    const segments = useSegments();

    // Fake session check because of the "Attempted to navigate before mounting" error
    useEffect(() => {
        setIsMounted(true); // mark the layout as mounted
    }, []);

    useEffect(() => {
        if (!isMounted) return; // if the layout is not mounted, do nothing

        const isProtected = segments[1] === "(authenticated)";

        console.log("➡️(_layout.tsx) - isProtected: ", isProtected);

        // fake session check
        if(session && !isProtected) {
            router.replace("/")
        } else if(!session && isProtected) {
            router.replace("/login")
        }

    }, [session, isMounted]);

     return <Slot />;
}

export default AppLayout