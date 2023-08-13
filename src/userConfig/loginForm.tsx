import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook, FaTwitter, FaLinkedin, FaRegEyeSlash, FaRegEye } from "react-icons/fa"
import useLogin from "@/hooks/login";
import { Login } from "@/services/user";
import { Button } from "@/components/button";
import { BG } from "@/components/bg";
import Header from "@/layouts/header/nav";
import style from "./style/scss/signup.module.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [Key: string]: string }>({});
  const { loading, error, login } = useLogin();
  const { loginWithRedirect } = useAuth0();

  // validate form
  const validateForm = () => {
    let errors: { [Key: string]: string } = {};
    let valid = true;

    if (!email.trim()) {
      errors["email"] = "Please enter your email address"
      valid = false;
    } else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      errors["email"] = "Email address is not valid"
      valid = false;
    }
    if (!password.trim()) {
      errors["password"] = "Please enter your Password"
      valid = false;
    } else if (password.length < 6) {
      errors["password"] = "Password must be at least 6 characters"
      valid = false;
    }
    setErrors(errors)
    return valid;
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setErrors({});
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user: Login = { email, password };
    if (validateForm()) {
      login(user);
      resetForm();
    }
  };

  return (
    <>
      <Header />
      <section className={style.section}>
        <BG />
        <section className={`${style.padding_top} ${style.wrapper}`}>
          <h1 className={style.title}>Welcome Back</h1>
          <h2 className={style.socialbtn}>Login with
            <button onClick={() => loginWithRedirect()} className={style.social}>
              <FcGoogle className={style.icon} />
              <FaFacebook className={style.icon} />
              <FaTwitter className={style.icon} />
              <FaLinkedin className={style.icon} />
            </button>
          </h2>
          <h3 className={style.or}>or</h3>
          <form onSubmit={handleLogin} className={style.form}>
            <div className={style.form_group}>
              <label htmlFor="email" className={style.form_label}>Email</label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                name="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={style.form_input}
              />
              {errors.email && <p className={style.form_error}>{errors.email}</p>}
            </div>
            <div className={style.form_group}>
              <label htmlFor="password" className={style.form_label}>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                placeholder="Enter Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={style.form_input}
              />
              <span className={style.form_password} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
              {errors.password && <p className={style.form_error}>{errors.password}</p>}
            </div>
            {error && <p className={style.form_error}>{error}</p>}
            <Button
              disabled={loading}
              children={loading ? "Get In..." : "Login"}
              className={style.form_button}
            />
          </form>
          <p className={style.link}>Don't have an account? <Link to="/signUp" className={style.login}>Sign-up!</Link></p>
        </section>
      </section>
    </>
  );
}

export default LoginForm