import usePasswordUpdate from "@/hooks/updatePassword";
import { useAuthContext } from "@/context/userContext";
import { PasswordUpdate } from "@/services/user";
import { useState } from "react";
import { Button } from "@/components/button";
import { FaExpeditedssl } from "react-icons/fa";
import style from "./style/style.module.css";

const UpdatePassword = () => {
  const [inputPassword, setInputPassword] = useState<{ password: string }>({ password: "" });
  const [inputNewPassword, setInputNewPassword] = useState<{ newPassword: string }>({ newPassword: "" });
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { loading, success, error, updatePassword } = usePasswordUpdate();
  const { state } = useAuthContext();
  const username: string = state.username || "";
  const password: string = inputPassword.password;
  const newPassword: string = inputNewPassword.newPassword;

  // validate password
  const validateForm = () => {
    let errors: { [key: string]: string } = {};
    let valid = true;

    if (!password) {
      errors["password"] = "Please enter your Password";
      valid = false;
    } else if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
      errors["password"] = "Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, and one number";
      valid = false;
    }
    if (!newPassword) {
      errors["newPassword"] = "Please enter a New Password"
      valid = false
    } else if (!newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
      errors["newPassword"] = "Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, and one number"
      valid = false
    }
    if (!confirmNewPassword) {
      errors["confirmNewPassword"] = "Confirm New Password cannot be empty"
      valid = false
    } else if (!confirmNewPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
      errors["confirmNewPassword"] = "Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, and one number"
      valid = false
    } else if (newPassword !== confirmNewPassword) {
      errors["confirmNewPassword"] = "Passwords do not match"
      valid = false
    }
    setErrors(errors)
    return valid
  }

  const resetForm = () => {
    setInputPassword({ password: "" });
    setInputNewPassword({ newPassword: "" });
    setConfirmNewPassword("");
    setErrors({})
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: PasswordUpdate = { username, password, newPassword };
    if (validateForm()) {
      updatePassword(data);
      resetForm();
    }
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>Change Password</h1>
      <form onSubmit={handlePasswordUpdate} className={style.form}>
        <div className={style.wrapper}>
          <p className={style.subtitle}>old password</p>
          <input
            type="password"
            placeholder="Enter your old password."
            value={inputPassword.password}
            onChange={(e) => setInputPassword({ password: e.target.value })}
            className={style.input}
          />
          {errors["password"] && (<p className={style.error}>{errors["password"]}</p>)}
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
          {errors["newPassword"] && (<p className={style.error}>{errors["newPassword"]}</p>)}
        </div>
        <div className={style.wrapper}>
          <p className={style.subtitle}>confirm new password</p>
          <input
            type="password"
            placeholder="Confirm your new password."
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className={style.input}
          />
          {errors["confirmNewPassword"] && (<p className={style.error}>{errors["confirmNewPassword"]}</p>)}
        </div>
        {success && <p className={style.success}>{success}</p>}
        {error && <p className={style.error}>{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          children={loading ? "Updating..." : <span className={style.span}>Update<FaExpeditedssl className={style.icon} /></span>}
          className={style.btn2}
        />
      </form>
    </div>
  )
}

export default UpdatePassword