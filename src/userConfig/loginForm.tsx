import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FcGoogle } from "react-icons/fc";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaRegEyeSlash,
  FaRegEye,
} from "react-icons/fa";
import { Heart, Mail, Lock, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import useLogin from "@/hooks/login";
import usePageTransition from "@/hooks/pageTransition";
import { Login as LoginType } from "@/services/user";
import { Button } from "@/components/button";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import { SEOHelmet } from "@/components/utils/seoUtils";
import style from "./style/scss/login/login.module.scss";

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

    if (!email.trim()) {
      newErrors.email = "Enter your email address";
    } else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Enter your password";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setErrors({});
    setRememberMe(false);
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user: LoginType = { email, password };

    if (validateForm()) {
      login(user);
      resetForm();
    }
  };

  return (
    <>
      <SEOHelmet
        title="Sign In"
        description="Access your HospitoFind account to manage saved hospitals and view global health alerts."
      />

      <Header />

      <main className={`${style.section} ${style[transitionClass]}`}>
        <section className={style.left}>
          <div className={style.overlay}></div>
          <div className={style.content}>
            <div className={style.logoGroup}>
              <div className={style.logoIcon}>
                <Heart className={style.heartIcon} fill="currentColor" />
              </div>
              <h1 className={style.logoText}>HospitoFind</h1>
            </div>

            <h2 className={style.welcome}>Welcome Back</h2>
            <p className={style.tagline}>
              Your health matters. Let us help you find care you can trust, wherever you are.
            </p>

            <div className={style.features}>
              <div className={style.feature}>
                <div className={style.iconCircle}><Clock size={20} /></div>
                <p>24/7 Healthcare Access</p>
              </div>
              <div className={style.feature}>
                <div className={style.iconCircle}><ShieldCheck size={20} /></div>
                <p>Secure and Private Account</p>
              </div>
            </div>
          </div>
        </section>

        <section className={style.right}>
          <div className={style.wrapper}>
            <div className={style.header}>
              <h1 className={style.title}>Sign in</h1>
              <p className={style.subtitle}>
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleLogin} className={style.form}>
              <div className={style.form_wrapper}>
                <div className={style.form_group}>
                  <label htmlFor="email">Email Address</label>
                  <div className={style.inputWrapper}>
                    <Mail className={style.inputIcon} />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      className={`${style.form_input} ${errors.email ? style.invalid : ""}`}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && <p className={style.form_error}>{errors.email}</p>}
                </div>

                <div className={style.form_group}>
                  <label htmlFor="password">Password</label>
                  <div className={style.inputWrapper}>
                    <Lock className={style.inputIcon} />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: "" });
                      }}
                      className={`${style.form_input} ${errors.password ? style.invalid : ""}`}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className={style.togglePassword}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                  </div>
                  {errors.password && <p className={style.form_error}>{errors.password}</p>}
                </div>
              </div>

              <div className={style.form_footer}>
                <label className={style.remember}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className={style.forgot}>
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className={style.alertError}>
                  <p>{typeof error === "string" ? error : (error as Error).message}</p>
                </div>
              )}

              <Button
                disabled={loading}
                className={style.form_button}
                type="submit"
              >
                {loading ? "Signing In..." : "Login"}
                <ArrowRight className={style.arrowIcon} size={18} />
              </Button>
            </form>

            <div className={style.divider}>
              <span className={style.dividerText}>Or continue with</span>
            </div>

            <div className={style.socialBtn}>
              <button
                onClick={() => loginWithRedirect({ authorizationParams: { connection: 'google-oauth2' } })}
                className={style.social}
                title="Google"
              >
                <FcGoogle size={24} />
              </button>
              <button
                onClick={() => loginWithRedirect({ authorizationParams: { connection: 'facebook' } })}
                className={style.social}
                title="Facebook"
              >
                <FaFacebook size={24} color="#1877F2" />
              </button>
              <button
                onClick={() => loginWithRedirect({ authorizationParams: { connection: 'twitter' } })}
                className={style.social}
                title="Twitter"
              >
                <FaTwitter size={24} color="#1DA1F2" />
              </button>
              <button
                onClick={() => loginWithRedirect({ authorizationParams: { connection: 'linkedin' } })}
                className={style.social}
                title="LinkedIn"
              >
                <FaLinkedin size={24} color="#0A66C2" />
              </button>
            </div>

            <p className={style.link}>
              Don’t have an account?{" "}
              <Link to="/signup" className={style.login}>
                Sign Up
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default LoginForm;