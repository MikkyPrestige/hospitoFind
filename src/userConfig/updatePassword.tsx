import usePasswordUpdate from "@/hooks/updatePassword";
import { useAuthContext } from "@/context/userContext";
import { PasswordUpdate } from "@/services/user";
import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import style from "./style/updatePassword.module.css";

const UpdatePassword = () => {
  const [inputPassword, setInputPassword] = useState<{ password: string }>({ password: "" });
  const [inputNewPassword, setInputNewPassword] = useState<{ newPassword: string }>({ newPassword: "" });
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { loading, success, error, updatePassword } = usePasswordUpdate();
  const { state } = useAuthContext();
  const username: string = state.username || "";
  const password: string = inputPassword.password;
  const newPassword: string = inputNewPassword.newPassword;

  // Automatically hide success message after 3 seconds
  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const validateForm = () => {
    let errors: { [key: string]: string } = {};
    let valid = true;

    if (!password) {
      errors["password"] = "Enter your Password";
      valid = false;
    } else if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
      errors["password"] = "Password must have at least 6 chars, 1 uppercase, 1 lowercase & 1 number";
      valid = false;
    }
    if (!newPassword) {
      errors["newPassword"] = "Enter a New Password";
      valid = false;
    } else if (!newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
      errors["newPassword"] = "Password must have at least 6 chars, 1 uppercase, 1 lowercase & 1 number";
      valid = false;
    }
    if (!confirmNewPassword) {
      errors["confirmNewPassword"] = "Confirm New Password";
      valid = false;
    } else if (newPassword !== confirmNewPassword) {
      errors["confirmNewPassword"] = "Passwords do not match";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const resetForm = () => {
    setInputPassword({ password: "" });
    setInputNewPassword({ newPassword: "" });
    setConfirmNewPassword("");
    setErrors({});
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
        {/* Old Password */}
        <div className={style.wrapper}>
          <p className={style.subtitle}>Old Password</p>
          <div className={style.passwordBox}>
            <input
              type={showOld ? "text" : "password"}
              placeholder="Enter your old password"
              value={inputPassword.password}
              onChange={(e) => setInputPassword({ password: e.target.value })}
              className={style.input}
            />
            <span className={style.eyeIcon} onClick={() => setShowOld(!showOld)}>
              {showOld ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {errors["password"] && <p className={style.error}>{errors["password"]}</p>}
        </div>

        {/* New Password */}
        <div className={style.wrapper}>
          <p className={style.subtitle}>New Password</p>
          <div className={style.passwordBox}>
            <input
              type={showNew ? "text" : "password"}
              placeholder="Enter your new password"
              value={inputNewPassword.newPassword}
              onChange={(e) => setInputNewPassword({ newPassword: e.target.value })}
              className={style.input}
            />
            <span className={style.eyeIcon} onClick={() => setShowNew(!showNew)}>
              {showNew ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {errors["newPassword"] && <p className={style.error}>{errors["newPassword"]}</p>}
        </div>

        {/* Confirm Password */}
        <div className={style.wrapper}>
          <p className={style.subtitle}>Confirm New Password</p>
          <div className={style.passwordBox}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className={style.input}
            />
            <span className={style.eyeIcon} onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {errors["confirmNewPassword"] && <p className={style.error}>{errors["confirmNewPassword"]}</p>}
        </div>

        {showSuccess && <p className={`${style.success} ${style.fadeIn}`}>{success}</p>}
        {error && <p className={style.error}>{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          children={
            loading ? "Updating..." : (
              <span className={style.span}>
                Update
              </span>
            )
          }
          className={style.btn2}
        />
      </form>
    </div>
  );
};

export default UpdatePassword;