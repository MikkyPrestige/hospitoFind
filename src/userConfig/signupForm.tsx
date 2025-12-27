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
import {
  Heart, Mail, Lock, User, UserCircle,
  ArrowRight, MapPin, Globe, ShieldCheck
} from "lucide-react";

import useSignUp from "@/hooks/signup";
import usePageTransition from "@/hooks/pageTransition";
import { User as UserType } from "@/services/user";
import { Button } from "@/components/button";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import { SEOHelmet } from "@/components/utils/seoUtils";
import style from "./style/scss/signup/signup.module.scss";

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { loading, error, signUp } = useSignUp();
  const { loginWithRedirect } = useAuth0();
  const transitionClass = usePageTransition();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Enter your full name";
    if (!username.trim()) newErrors.username = "Choose a username";
    if (!email.trim()) newErrors.email = "Email address is required";
    else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      newErrors.email = "Please enter a valid email";

    if (!password.trim())
      newErrors.password = "Password is required";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(password))
      newErrors.password = "Requires 6+ chars, uppercase, lowercase, & number";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user: UserType = {
      name,
      username,
      email,
      password
    };

    if (validateForm()) {
      signUp(user);
    }
  };

  return (
    <>
      <SEOHelmet
        title="Create an Account"
        description="Join the HospitoFind community to save hospital searches, track healthcare facilities, and access global health alerts."
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

            <h2 className={style.welcome}>Join Our Community</h2>
            <p className={style.tagline}>
              Empowering your healthcare journey through a global network of trusted hospitals and real-time medical insights.
            </p>

            <div className={style.features}>
              <div className={style.feature}>
                <div className={style.iconCircle}><MapPin size={20} /></div>
                <p>Discover verified hospitals in your current location</p>
              </div>
              <div className={style.feature}>
                <div className={style.iconCircle}><Globe size={20} /></div>
                <p>Access healthcare directories from many countries</p>
              </div>
              <div className={style.feature}>
                <div className={style.iconCircle}><ShieldCheck size={20} /></div>
                <p>Your data is protected with healthcare-grade security</p>
              </div>
            </div>
          </div>
        </section>

        <section className={style.right}>
          <div className={style.wrapper}>
            <div className={style.header}>
              <h1 className={style.title}>Create an account</h1>
              <p className={style.subtitle}>
                Start your journey to better healthcare access today.
              </p>
            </div>

            <form onSubmit={handleSignUp} className={style.form}>
              <div className={style.formGrid}>
                <div className={style.form_group}>
                  <label htmlFor="name">Full Name</label>
                  <div className={style.inputWrapper}>
                    <User className={style.inputIcon} />
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={`${style.form_input} ${errors.name ? style.invalid : ""}`}
                    />
                  </div>
                  {errors.name && <p id="name-error" className={style.form_error}>{errors.name}</p>}
                </div>

                <div className={style.form_group}>
                  <label htmlFor="username">Username</label>
                  <div className={style.inputWrapper}>
                    <UserCircle className={style.inputIcon} />
                    <input
                      id="username"
                      type="text"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      aria-invalid={!!errors.username}
                      aria-describedby={errors.username ? "user-error" : undefined}
                      className={`${style.form_input} ${errors.username ? style.invalid : ""}`}
                    />
                  </div>
                  {errors.username && <p id="user-error" className={style.form_error}>{errors.username}</p>}
                </div>

                <div className={`${style.form_group} ${style.fullWidth}`}>
                  <label htmlFor="email">Email Address</label>
                  <div className={style.inputWrapper}>
                    <Mail className={style.inputIcon} />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={`${style.form_input} ${errors.email ? style.invalid : ""}`}
                    />
                  </div>
                  {errors.email && <p id="email-error" className={style.form_error}>{errors.email}</p>}
                </div>

                <div className={style.form_group}>
                  <label htmlFor="password">Password</label>
                  <div className={style.inputWrapper}>
                    <Lock className={style.inputIcon} />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${style.form_input} ${errors.password ? style.invalid : ""}`}
                    />
                    <button
                      type="button"
                      className={style.togglePassword}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                  </div>
                  {errors.password && <p className={style.form_error}>{errors.password}</p>}
                </div>

                <div className={style.form_group}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className={style.inputWrapper}>
                    <Lock className={style.inputIcon} />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`${style.form_input} ${errors.confirmPassword ? style.invalid : ""}`}
                    />
                    <button
                      type="button"
                      className={style.togglePassword}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className={style.form_error}>{errors.confirmPassword}</p>}
                </div>
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
                {loading ? "Creating Your Account..." : "Sign Up"}
                <ArrowRight className={style.arrowIcon} size={18} />
              </Button>
            </form>

            <div className={style.divider}>
              <span className={style.dividerText}>Or continue with</span>
            </div>

            <div className={style.socialBtn}>
              <button onClick={() => loginWithRedirect({ authorizationParams: { connection: 'google-oauth2' } })} className={style.social} title="Google">
                <FcGoogle size={24} />
              </button>
              <button onClick={() => loginWithRedirect({ authorizationParams: { connection: 'facebook' } })} className={style.social} title="Facebook">
                <FaFacebook size={24} color="#1877F2" />
              </button>
              <button onClick={() => loginWithRedirect({ authorizationParams: { connection: 'twitter' } })} className={style.social} title="Twitter">
                <FaTwitter size={24} color="#1DA1F2" />
              </button>
              <button onClick={() => loginWithRedirect({ authorizationParams: { connection: 'linkedin' } })} className={style.social} title="LinkedIn">
                <FaLinkedin size={24} color="#0A66C2" />
              </button>
            </div>

            <p className={style.link}>
              Already have an account?{" "}
              <Link to="/login" className={style.login}>
                Login
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SignUp;