import { useState, useEffect } from "react";
import useLogin from "@/hooks/login";
import { Login } from "@/services/userTypes";
import { useAuthContext } from "@/contexts/userContext";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, login } = useLogin();
  const { state } = useAuthContext();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
      <form onSubmit={handleSubmit}>
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
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default LoginForm