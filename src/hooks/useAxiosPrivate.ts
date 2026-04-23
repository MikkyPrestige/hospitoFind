import axios from "axios";
import { useEffect } from "react";
import { useAuthContext, BASE_URL } from "@/context/UserProvider";
import { api } from "@/services/api";

const useAxiosPrivate = () => {
    const { state, dispatch } = useAuthContext();

    useEffect(() => {
        // --- Request Interceptor ---
        const requestIntercept = api.interceptors.request.use(
            config => {
                const currentToken = localStorage.getItem("accessToken") || state.accessToken;
                if (!config.headers['Authorization'] && currentToken) {
                    config.headers['Authorization'] = `Bearer ${currentToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // --- Response Interceptor ---
        const responseIntercept = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                const isAuthError = error?.response?.status === 401 || error?.response?.status === 403;

                if (isAuthError && !prevRequest?._retry) {
                    prevRequest._retry = true;

                    try {
                        const response = await axios.get(`${BASE_URL}/auth/refresh`, {
                            withCredentials: true,
                        });

                        const { accessToken, ...otherData } = response.data;

                        dispatch({ type: 'REFRESH_TOKEN', payload: accessToken });

                        localStorage.setItem("accessToken", accessToken);
                        Object.entries(otherData).forEach(([key, value]) => {
                            if (value) localStorage.setItem(key, value.toString());
                        });

                        prevRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                        return api(prevRequest);

                    } catch (refreshError) {
                        dispatch({ type: 'LOGOUT' });
                        localStorage.clear();

                        if (!window.location.pathname.includes('/login')) {
                            window.location.href = "/login?expired=true";
                        }
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestIntercept);
            api.interceptors.response.eject(responseIntercept);
        };
    }, [state.accessToken, dispatch]);

    return api;
};

export default useAxiosPrivate;