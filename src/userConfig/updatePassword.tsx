import { useState } from "react";
import { Link } from "react-router-dom";
import usePasswordUpdate from "@/hooks/user/updatePassword";
import { useAuthContext } from "@/context/userContext";
import { Button } from "@/components/button";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import style from "./style/updatePassword.module.css";

const UpdatePassword = () => {
  const { state } = useAuthContext();
  const { loading, updatePassword } = usePasswordUpdate();

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

    if (!passwords.oldPassword) newErrors.old = "Current password is required";
    if (!passRegex.test(passwords.newPassword)) {
      newErrors.new = "Must contain 6+ chars, 1 uppercase, 1 lowercase & 1 number";
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      updatePassword({
        username: state.username || "",
        password: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const toggleShow = (key: string) => {
    setShowPass(prev => ({ ...prev, [key]: !prev[key as keyof typeof showPass] }));
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      {[
        { id: 'current', label: 'Current Password', key: 'oldPassword' as const, placeholder: '••••••••' },
        { id: 'new', label: 'New Password', key: 'newPassword' as const, placeholder: '••••••••' },
        { id: 'confirm', label: 'Confirm New Password', key: 'confirmPassword' as const, placeholder: '••••••••' }
      ].map((field) => (
        <div className={style.wrapper} key={field.id}>
          <p className={style.subtitle}>{field.label}</p>
          <div className={style.passwordBox}>
            <input
              type={showPass[field.id as keyof typeof showPass] ? "text" : "password"}
              value={passwords[field.key as keyof typeof passwords]}
              onChange={(e) => setPasswords({ ...passwords, [field.key]: e.target.value })}
              className={`${style.input} ${errors[field.id] ? style.invalid : ''}`}
              placeholder={field.placeholder}
            />
            <span
              className={style.eyeIcon}
              onClick={() => toggleShow(field.id)}
              role="button"
              tabIndex={0}
            >
              {showPass[field.id as keyof typeof showPass] ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {errors[field.id] && <p className={style.error}>{errors[field.id]}</p>}
        </div>
      ))}
      <div className={style.forgotRow}>
        Forgot your current password?{' '}
        <Link
          to="/forgot-password"
          className={style.resetLink}
        >
          Reset it here
        </Link>
      </div>

      <div className={style.actionRow}>
      <Button type="submit" disabled={loading} className={style.btn}>
        {loading ? "Updating Security..." : "Change Password"}
      </Button>
      </div>
    </form>
  );
};

export default UpdatePassword;