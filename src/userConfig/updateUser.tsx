import { useState } from "react";
import { User } from "@/services/user";
import { useAuthContext } from "@/context/userContext";
import useUpdate from "@/hooks/update";
import { Button } from "@/components/button";
import style from "./style/style.module.css";

const UpdateUser = () => {
  const { state } = useAuthContext();
  const [name, setName] = useState<string>(state.name ? state.name : "");
  const [email, setEmail] = useState<string>(state.email ? state.email : "");
  const [password, setPassword] = useState<string>("");
  const { loading, success, error, update } = useUpdate();
  const username: string = state.username || "";
  const placeholderName: string = state.name || "";
  const placeholderEmail: string = state.email || "";

  const handleUserUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user: User = { name, username, email, password };
    update(user);
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "name":
        setName(e.target.value);
        break;
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
    }
  }

  return (
    <section className={style.section}>
      <form onSubmit={handleUserUpdate} className={style.form}>
        <div className={style.wrapper}>
          <p className={style.subtitle}>Name</p>
          <input
            type="text"
            placeholder={placeholderName}
            name="name"
            value={name}
            onChange={handleInput}
            className={style.input}
          />
        </div>
        <div className={style.wrapper}>
          <p className={style.subtitle}>Email</p>
          <input
            type="email"
            placeholder={placeholderEmail}
            name="email"
            value={email}
            onChange={handleInput}
            className={style.input}
          />
        </div>
        <div className={style.wrapper}>
          <p className={style.subtitle}>Password</p>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={password}
            onChange={handleInput}
            className={style.input}
          />
        </div>
        {success && <p className={style.success}>{success}</p>}
        {error && <p className={style.error}>{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          children={loading ? "Updating..." : <span className={style.span}>Update</span>}
          className={style.btn2}
        />
      </form>
    </section>
  );
}

export default UpdateUser