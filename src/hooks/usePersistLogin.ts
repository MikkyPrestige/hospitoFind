import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuthContext, BASE_URL } from "@/context/UserProvider";

export const usePersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { state, dispatch } = useAuthContext();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/auth/refresh`, {
                    withCredentials: true
                });

                dispatch({
                    type: 'REFRESH',
                    payload: response.data
                });
            } catch (err) {
                const authPages = ['/login', '/signup', '/verify-email', '/email-sent'];
                const isAuthPage = authPages.some(path => location.pathname.includes(path));

                if (!isAuthPage) {
                    localStorage.removeItem("accessToken");
                    dispatch({ type: 'LOGOUT' });
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        const storedToken = localStorage.getItem("accessToken");

        if (!state?.accessToken && storedToken) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [location.pathname, dispatch, state?.accessToken]);

    return { isLoading };
};