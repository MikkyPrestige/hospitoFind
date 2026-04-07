import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaRegEyeSlash,
  FaRegEye,
} from "react-icons/fa";
import { Heart, Mail, Lock, ArrowRight, ShieldCheck, RefreshCw, Globe } from 'lucide-react';
import useLogin from "@/hooks/useLogin";
import usePageTransition from "@/hooks/usePageTransition";
import { Login as LoginType } from "@/src/types/user";
import { Button } from "@/components/ui/Button";
import SimpleHeader from "@/layouts/header/simpleHeader";
import SimpleFooter from "@/layouts/footer/simpleFooter";
import { SEOHelmet } from "@/components/ui/SeoHelmet";
import { BASE_URL } from "@/context/UserProvider";
import style from "./styles/login/login.module.scss";
import Logo from "@/assets/images/logo.svg"

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const { loading, login, success, user } = useLogin();
  const { loginWithRedirect } = useAuth0();
  const transitionClass = usePageTransition();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (success && user) {
      const timer = setTimeout(() => {
        const targetPath = user.role === "admin" ? "/admin" : "/dashboard";
        navigate(targetPath, { replace: true });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [success, user, navigate]);


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Please enter your registered email";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNeedsVerification(false);

    if (validateForm()) {
      if (rememberMe) {
        localStorage.setItem("remember_email", email);
      } else {
        localStorage.removeItem("remember_email");
      }

      localStorage.removeItem("accessToken");
      const loginCredentials: LoginType = { email, password };

      try {
        await login(loginCredentials);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setNeedsVerification(true);
        }
      }
    }
  };

  const handleResendLink = async () => {
    setResending(true);
    try {
      await axios.post(`${BASE_URL}/auth/resend-verification`, { email });
      toast.success("A new verification link has been sent to your inbox.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Unable to resend verification link.");
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <SEOHelmet title="Secure Login" description="Sign in to access your saved hospitals and track your healthcare history." />
      <SimpleHeader />

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

            <h2 className={style.welcome}>Continue Your Journey</h2>
            <p className={style.tagline}>
              Reconnect with your personalized healthcare dashboard. Access saved facilities, track your history, and contribute to the network.
            </p>

            <div className={style.features}>
              <div className={style.feature}>
                <div className={style.iconCircle}><Globe size={20} /></div>
                <p>Sync History Across Devices</p>
              </div>
              <div className={style.feature}>
                <div className={style.iconCircle}><ShieldCheck size={20} /></div>
                <p>Secure and Private Account</p>
              </div>
            </div>
          </div>
        </section>

        <section className={style.right}>
          <div className={style.mobileLogo}>
            <img src={Logo} alt="HospitoFind Logo" />
          </div>
          <div className={style.wrapper}>
            <div className={style.header}>
              <h1 className={style.title}>Secure Login</h1>
              <p className={style.subtitle}>Enter your credentials to access your dashboard.</p>
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
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${style.form_input} ${errors.email ? style.invalid : ""}`}
                    />
                  </div>
                  {errors.email && <p className={style.form_error}>{errors.email}</p>}
                </div>

                {/* Password Input */}
                <div className={style.form_group}>
                  <label htmlFor="password">Password</label>
                  <div className={style.inputWrapper}>
                    <Lock className={style.inputIcon} />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${style.form_input} ${errors.password ? style.invalid : ""}`}
                    />
                    <button type="button" className={style.togglePassword} onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className={style.form_error}>{errors.password}</p>}
                </div>
              </div>

              {needsVerification && (
                <div style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  backgroundColor: "#fff5f5",
                  border: "1px solid #feb2b2",
                  borderRadius: "12px",
                  textAlign: "center"
                }}>
                  <p style={{ color: "#c53030", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                    Action Required: Email Verification Pending
                  </p>
                  <button
                    type="button"
                    disabled={resending}
                    onClick={handleResendLink}
                    style={{
                      color: "#0e3db7", fontSize: "0.85rem", fontWeight: 700,
                      background: "none", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", width: "100%"
                    }}
                  >
                    {resending ? <RefreshCw size={14} className="animate-spin" /> : null}
                    {resending ? "Sending Email..." : "Request New Verification Link"}
                  </button>
                </div>
              )}

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

              <Button disabled={loading} className={style.form_button} type="submit">
                {loading ? "Authenticating..." : "Access Dashboard"}
                <ArrowRight className={style.arrowIcon} size={18} />
              </Button>
            </form>

            <div className={style.divider}><span className={style.dividerText}>Or sign in using</span></div>

            {/* Social Buttons */}
            <div className={style.socialBtn}>
              <button
                onClick={() => loginWithRedirect({ authorizationParams: { connection: 'google-oauth2' } })}
                className={style.social}
                title="Sign in with Google"
              >
                <FcGoogle size={24} />
              </button>
              <button
                onClick={() => loginWithRedirect({ authorizationParams: { connection: 'facebook' } })}
                className={style.social}
                title="Sign in with Facebook"
              >
                <FaFacebook size={24} color="#1877F2" />
              </button>
              <button
                onClick={() => loginWithRedirect({ authorizationParams: { connection: 'twitter' } })}
                className={style.social}
                title="Sign in with Twitter"
              >
                <FaTwitter size={24} color="#1DA1F2" />
              </button>
              <button
                onClick={() => loginWithRedirect({ authorizationParams: { connection: 'linkedin' } })}
                className={style.social}
                title="Sign in with LinkedIn"
              >
                <FaLinkedin size={24} color="#0A66C2" />
              </button>
            </div>

            <p className={style.link}>
              New to HospitoFind? <Link to="/signup" className={style.login}>Create an Account</Link>
            </p>
          </div>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default LoginForm;