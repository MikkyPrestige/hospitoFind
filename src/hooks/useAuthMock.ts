import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/userContext";

export const useAuthMock = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  useEffect(() => {
    // Only activate in development
    if (import.meta.env.MODE !== "development") return;

    const mockUser = {
      name: "Mikky",
      username: "mikkydev",
      email: "dev@hospitofind.test",
      accessToken: "fake-access-token",
    };

    localStorage.setItem("mockUser", JSON.stringify(mockUser));

    dispatch({
      type: "LOGIN",
      payload: mockUser,
    });

    navigate("/dashboard");
  }, [dispatch, navigate]);
};