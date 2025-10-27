import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  FcGoogle
} from "react-icons/fc";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaRegEyeSlash,
  FaRegEye
} from "react-icons/fa";
import useLogin from "@/hooks/login";
import usePageTransition from "@/hooks/pageTransition";
import { Login } from "@/services/user";
import { Button } from "@/components/button";
import { BG } from "@/components/bg";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import style from "./style/scss/signup.module.css";
import image from "../assets/images/logo.svg";


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { loading, error, login } = useLogin();
  const { loginWithRedirect } = useAuth0();
  const transitionClass = usePageTransition();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) newErrors.email = "Enter your email address";
    else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      newErrors.email = "Email address is not valid";

    if (!password.trim()) newErrors.password = "Enter your password";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // real-time feedback
  const handleChange = (field: string, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setErrors({});
    setRememberMe(false);
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
      <section className={`${style.section} ${style[transitionClass]}`}>
        <BG />
        <div className={style.loginContainer}>
          <div className={style.imageSection}>
            <img
              src={image}
              alt="HospitoFind Logo"
              className={style.image}
            />
            <h2 className={style.tagline}>
              “Find trusted hospitals near you.<br />
              Your health search starts here.”
            </h2>
          </div>

          <section className={style.wrapper}>
            <h1 className={style.title}>
              Welcome Back to <span className={style.brand}>HospitoFind</span>
            </h1>
            <p className={style.subtitle}>Continue with your account</p>

            <div className={style.socialBtn}>
              <button onClick={() => loginWithRedirect()} className={style.social}><FcGoogle className={style.icon} /></button>
              <button onClick={() => loginWithRedirect()} className={style.social}><FaFacebook className={style.icon} /></button>
              <button onClick={() => loginWithRedirect()} className={style.social}><FaTwitter className={style.icon} /></button>
              <button onClick={() => loginWithRedirect()} className={style.social}><FaLinkedin className={style.icon} /></button>
            </div>

            <h3 className={style.or}>or login with email</h3>

            <form onSubmit={handleLogin} className={style.form}>
              <div className={style.form_group}>
                <label htmlFor="email" className={style.form_label}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`${style.form_input} ${errors.email ? style.invalid : ""}`}
                  autoComplete="email"
                />
                {errors.email && <p className={style.form_error}>{errors.email}</p>}
              </div>

              <div className={style.form_group}>
                <label htmlFor="password" className={style.form_label}>Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`${style.form_input} ${errors.password ? style.invalid : ""}`}
                  autoComplete="current-password"
                />
                <span className={style.form_password} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
                {errors.password && <p className={style.form_error}>{errors.password}</p>}
              </div>

              <div className={style.form_footer}>
                <label className={style.remember}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className={style.forgot}>Forgot password?</Link>
              </div>
              {error && (
                <p className={style.form_error}>
                  {typeof error === "string" ? error : (error as Error).message}
                </p>
              )}
              <Button
                disabled={loading}
                children={loading ? "Signing In..." : "Sign In Securely"}
                className={style.form_button}
              />
            </form>

            <p className={style.link}>
              New here? <Link to="/signUp" className={style.login}>Create an account</Link>
            </p>
          </section>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default LoginForm;