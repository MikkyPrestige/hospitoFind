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
  FaRegEye,
} from "react-icons/fa";
import { Heart, Mail, Lock, ArrowRight } from 'lucide-react'
import useLogin from "@/hooks/login";
import usePageTransition from "@/hooks/pageTransition";
import { Login } from "@/services/user";
import { Button } from "@/components/button";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import style from "./style/scss/signup.module.scss";


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
      <div className={`${style.section} ${style[transitionClass]}`}>
        <div className={style.left}>
          <div className={style.overlay}></div>
          <div className={style.content}>
            <div className={style.logoGroup}>
              <div className={style.logoIcon}>
                <Heart className={style.heartIcon} fill="white" />
              </div>
              <h1 className={style.logoText}>HospitoFind</h1>
            </div>
            <h2 className={style.welcome}>Welcome Back</h2>
            <p className={style.tagline}>
              Your health matters. Let us help you find care you can trust, wherever you are.
            </p>
            <div className={style.features}>
              <div className={style.feature}>
                <span className={style.featureIcon}>🏥</span>
                <p>24/7 Healthcare Access</p>
              </div>
              <div className={style.feature}>
                <span className={style.featureIcon}>🔒</span>
                <p>Secure and Private</p>
              </div>
            </div>
          </div>
        </div>

        <div className={style.right}>
          <div className={style.wrapper}>
            {/* <h2 className={style.title}>Sign In</h2> */}
            <p className={style.subtitle}>
              Enter your credentials to access your account
            </p>

            <form onSubmit={handleLogin} className={style.form}>
              <div className={style.form_group}>
                <label htmlFor="email">Email Address</label>
                <div className={style.inputWrapper}>
                  <Mail className={style.inputIcon} />
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`${style.form_input} ${errors.email ? style.invalid : ""
                      }`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className={style.form_error}>{errors.email}</p>
                )}
              </div>

              <div className={style.form_group}>
                <label htmlFor="password">Password</label>
                <div className={style.inputWrapper}>
                  <Lock className={style.inputIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className={`${style.form_input} ${errors.password ? style.invalid : ""
                      }`}
                    autoComplete="current-password"
                  />
                  <span
                    className={style.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </span>
                </div>
                {errors.password && (
                  <p className={style.form_error}>{errors.password}</p>
                )}
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
                <Link to="/forgot-password" className={style.forgot}>
                  Forgot password?
                </Link>
              </div>

              {error && (
                <p className={style.form_error}>
                  {typeof error === "string"
                    ? error
                    : (error as Error).message}
                </p>
              )}

              <Button
                disabled={loading}
                children={
                  loading ? "Signing In..." : (
                    <>
                      Sign In <ArrowRight className={style.arrowIcon} />
                    </>
                  )
                }
                className={style.form_button}
              />
            </form>

            <div className={style.divider}>
              <div className={style.dividerLine}></div>
              <span className={style.dividerText}>Or continue with</span>
            </div>
            <div className={style.socialBtn}>
              <button
                onClick={() => loginWithRedirect()}
                className={style.social}
              >
                <FcGoogle className={style.icon} />
              </button>
              <button
                onClick={() => loginWithRedirect()}
                className={style.social}
              >
                <FaFacebook className={style.icon} />
              </button>
              <button
                onClick={() => loginWithRedirect()}
                className={style.social}
              >
                <FaTwitter className={style.icon} />
              </button>
              <button
                onClick={() => loginWithRedirect()}
                className={style.social}
              >
                <FaLinkedin className={style.icon} />
              </button>
            </div>

            <p className={style.link}>
              Don’t have an account?{" "}
              <Link to="/signUp" className={style.login}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginForm;