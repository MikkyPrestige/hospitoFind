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
import { Heart, Mail, Lock, User, UserCircle, ArrowRight } from "lucide-react"
import useSignUp from "@/hooks/signup";
import usePageTransition from "@/hooks/pageTransition";
import { User as UserType } from "@/services/user";
import { Button } from "@/components/button";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import style from "./style/scss/signup.module.css";

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

    if (!name.trim()) newErrors.name = "Enter your name";
    if (!username.trim()) newErrors.username = "Enter a username";
    if (!email.trim()) newErrors.email = "Enter your email address";
    else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      newErrors.email = "Email address is not valid";
    if (!password.trim())
      newErrors.password = "Enter password";
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(password)
    )
      newErrors.password =
        "Password must have 6+ chars, uppercase, lowercase, and a number";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm your password";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user: UserType = { name, username, email, password };
    if (validateForm()) signUp(user);
  };

  return (
    <>
      <Header />
      <section className={`${style.section} ${style[transitionClass]}`}>
        <div className={style.left}>
          <div className={style.overlay}></div>
          <div className={style.content}>
            <div className={style.logoGroup}>
              <div className={style.logoIcon}>
                <Heart className={style.heartIcon} fill="white" />
              </div>
              <h1 className={style.logoText}>HospitoFind</h1>
            </div>

            <h2 className={style.welcome}>Join Our Community</h2>
            <p className={style.tagline}>
              Discover trusted hospitals and help others make informed health decisions — your experience could guide someone’s healing journey.
            </p>

            <div className={style.features}>
              <div className={style.feature}>
                <div className={style.featureIcon}>🏥</div>
                <p>Find verified hospitals near you</p>
              </div>
              <div className={style.feature}>
                <div className={style.featureIcon}>🌍</div>
                <p>Connect with healthcare globally</p>
              </div>
            </div>
          </div>
        </div>

        <div className={style.right}>
          <div className={style.wrapper}>
            {/* <h1 className={style.title}>Create an account</h1> */}
            <p className={style.subtitle}>
              Enter your information to get started with HospitoFind
            </p>

            <form onSubmit={handleSignUp} className={style.form}>
              <div className={style.form_group}>
                <label htmlFor="name">Full Name</label>
                <div className={style.inputWrapper}>
                  <User className={style.inputIcon} />
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${style.form_input} ${errors.name ? style.invalid : ""}`}
                  />
                </div>
                {errors.name && <p className={style.form_error}>{errors.name}</p>}
              </div>

              <div className={style.form_group}>
                <label htmlFor="username">Username</label>
                <div className={style.inputWrapper}>
                  <UserCircle className={style.inputIcon} />
                  <input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`${style.form_input} ${errors.username ? style.invalid : ""}`}
                  />
                </div>
                {errors.username && <p className={style.form_error}>{errors.username}</p>}
              </div>

              <div className={style.form_group}>
                <label htmlFor="email">Email</label>
                <div className={style.inputWrapper}>
                  <Mail className={style.inputIcon} />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${style.form_input} ${errors.email ? style.invalid : ""}`}
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
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${style.form_input} ${errors.password ? style.invalid : ""}`}
                  />
                  <span
                    className={style.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </span>
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
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${style.form_input} ${errors.confirmPassword ? style.invalid : ""
                      }`}
                  />
                  <span
                    className={style.togglePassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </span>
                </div>
                {errors.confirmPassword && (
                  <p className={style.form_error}>{errors.confirmPassword}</p>
                )}
              </div>

              {error && (
                <p className={style.form_error}>
                  {typeof error === "string" ? error : (error as Error).message}
                </p>
              )}

              <Button
                disabled={loading}
                className={style.form_button}
              >
                {loading ? "Creating Your Account..." : "Create Account"}
                <ArrowRight className={style.arrowIcon} />
              </Button>

              <div className={style.divider}>
                <div className={style.dividerLine}></div>
                <span className={style.dividerText}>Or continue with</span>
              </div>
              <div className={style.socialBtn}>
                <button onClick={() => loginWithRedirect()} className={style.social}>
                  <FcGoogle className={style.icon} />
                </button>
                <button onClick={() => loginWithRedirect()} className={style.social}>
                  <FaFacebook className={style.icon} />
                </button>
                <button onClick={() => loginWithRedirect()} className={style.social}>
                  <FaTwitter className={style.icon} />
                </button>
                <button onClick={() => loginWithRedirect()} className={style.social}>
                  <FaLinkedin className={style.icon} />
                </button>
              </div>
            </form>

            <p className={style.link}>
              Already have an account?{" "}
              <Link to="/login" className={style.login}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SignUp;