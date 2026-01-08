import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function usePageTransition() {
    const [transitionClass, setTransitionClass] = useState("pageTransition");
    const location = useLocation();

    useEffect(() => {
        setTransitionClass("pageTransitionExit");
        const timeout = setTimeout(() => {
            setTransitionClass("pageTransition");
        }, 400);

        return () => clearTimeout(timeout);
    }, [location.pathname]);

    return transitionClass;
}