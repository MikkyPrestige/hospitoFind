import { useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { User } from "@/services/user";
import { useAuthContext } from "@/context/userContext";
import useUpdate from "@/hooks/update";
import UpdatePassword from "@/userConfig/updatePassword";
import { Button } from "@/components/button";
import btnStyle from "./style/logout.module.css";
import style from "./style/delete.module.css";

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
    <div className={btnStyle.container}>
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
          <p className={style.subtitle}>Email Address</p>
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
        {success && <p className={btnStyle.success}>{success}</p>}
        {error && <p className={btnStyle.error}>{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          children={loading ? "Updating..." : <span className={btnStyle.span}>Update<FaUserEdit className={btnStyle.icon} /></span>}
          className={btnStyle.btn}
        />
      </form>
      <UpdatePassword />
    </div>
  );
}

export default UpdateUser