import { useEffect } from "react";
import { useAuthContext } from "@/context/userContext";
import { api } from "@/services/api";

const useAxiosPrivate = () => {
    const { state } = useAuthContext();

    useEffect(() => {
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

        return () => {
            api.interceptors.request.eject(requestIntercept);
        }
    }, [state.accessToken]);

    return api;
};

export default useAxiosPrivate;