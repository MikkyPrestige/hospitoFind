import { useState } from "react";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
// import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import useDelete from "@/hooks/delete";
import { useAuthContext } from "@/context/userContext";
import { Button } from "@/components/button";
import style from "./style/style.module.css";

const DeleteBtn = () => {
  const { loading, success, error, deleteUser } = useDelete();
  const [inputPassword, setInputPassword] = useState<{ password: string }>({ password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // const [showPassword, setShowPassword] = useState(false);
  const { state } = useAuthContext();
  const user: string = state.username || "";
  const password: string = inputPassword.password;

  const validate = () => {
    const errors: { [key: string]: string } = {};
    let valid = true;

    if (!password) {
      errors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      deleteUser(user, password);
    }

    setInputPassword({ password: "" });
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>Delete Account?</h1>
      <BsFillExclamationTriangleFill style={{ fill: "#FF033E", fontSize: "5rem" }} />
      <p className={style.subhead}>Deleting your account is permanent — all your saved and recently viewed hospitals will be removed from HospitoFind.</p>
      <form onSubmit={handleDelete} className={style.form}>
        <div className={style.wrapper}>
          <label className={style.subtitle} htmlFor="password">Type your password to confirm</label>
          <input
            // type={showPassword ? "text" : "password"}
            type="password"
            id="password"
            autoComplete="current-password"
            name="password"
            placeholder="password"
            value={inputPassword.password}
            onChange={(e) => setInputPassword({ password: e.target.value })}
            className={style.input}
          />
          {/* <span className={style.password} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span> */}
          {errors.password && <p className={style.error}>{errors.password}</p>}
        </div>
        {success && <p className={style.success}>{success}</p>}
        {error && <p className={style.error}>{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          children={loading ? "Deleting your account..." : <span className={style.span}>Confirm Delete</span>}
          className={style.btn}
        />
      </form>
    </div>
  )
}

export default DeleteBtn