import { useState, useEffect } from "react";
import useLogin from "@/hooks/logIn";
import { Login } from "@/services/userTypes";
import { useAuthContext } from "@/contexts/userContext";
import Logout from "./logOutBtn";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, login } = useLogin();
  const { state } = useAuthContext();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user: Login = { username, password };
    login(user);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      console.log("Logged in user:", user);
    }
  }, [state.user]);

  return (
    <div>
      {state.user && <p>{state.user}</p>}
      {/* <button onClick={() => loginWithRedirect()}>Login with Auth0</button> */}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Get In..." : "Login"}
        </button>
      </form>
      <Logout />
      {error && <p>{error}</p>}
    </div>
  );
}

export default LoginForm