import usePasswordUpdate from "@/hooks/updatePassword";
import { useAuthContext } from "@/context/userContext";
import { PasswordUpdate } from "@/services/user";
import { useState } from "react";
import { Button } from "@/components/button";
import { FaExpeditedssl } from "react-icons/fa";
import btnStyle from "./style/logout.module.css";
import style from "./style/delete.module.css";

const UpdatePassword = () => {
  const [inputPassword, setInputPassword] = useState<{ password: string }>({ password: "" });
  const [inputNewPassword, setInputNewPassword] = useState<{ newPassword: string }>({ newPassword: "" });
  const { loading, success, error, updatePassword } = usePasswordUpdate();
  const { state } = useAuthContext();
  const username: string = state.username || "";
  const password: string = inputPassword.password;
  const newPassword: string = inputNewPassword.newPassword;

  const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user: PasswordUpdate = { username, password, newPassword };
    updatePassword(user);
    setInputPassword({ password: "" });
    setInputNewPassword({ newPassword: "" });
  };

  return (
    <>
      <form onSubmit={handlePasswordUpdate} className={style.form}>
        <h1 className={style.title}>Change Password</h1>
        <div className={style.wrapper}>
          <p className={style.subtitle}>old password</p>
          <input
            type="password"
            placeholder="Enter your old password."
            value={inputPassword.password}
            onChange={(e) => setInputPassword({ password: e.target.value })}
            className={style.input}
          />
        </div>
        <div className={style.wrapper}>
          <p className={style.subtitle}>new password</p>
          <input
            type="password"
            placeholder="Enter your new password."
            value={inputNewPassword.newPassword}
            onChange={(e) => setInputNewPassword({ newPassword: e.target.value })}
            className={style.input}
          />
        </div>
        {success && <p className={btnStyle.success}>{success}</p>}
        {error && <p className={btnStyle.error}>{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          children={loading ? "Updating..." : <span className={btnStyle.span}>Update<FaExpeditedssl className={btnStyle.icon} /></span>}
          className={btnStyle.btn}
        />
      </form>
    </>
  )
}

export default UpdatePassword