import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

import useSignUp from "@/hooks/user/signup";
import usePageTransition from "@/hooks/pageTransition";
import { User as UserType } from "@/services/user";
import { Button } from "@/components/button";
import SimpleHeader from "@/layouts/header/simpleHeader";
import SimpleFooter from "@/layouts/footer/simpleFooter";
import { SEOHelmet } from "@/components/utils/seoUtils";
import style from "./style/scss/signup/signup.module.scss";
import Logo from "@/assets/images/logo.svg"

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { loading, signUp, success } = useSignUp();
  const { loginWithRedirect } = useAuth0();
  const transitionClass = usePageTransition();
const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Please enter your full name";
    if (!username.trim()) newErrors.username = "A unique username is required";
    if (!email.trim()) newErrors.email = "Email address is required";
    else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      newErrors.email = "Please enter a valid email address";

    if (!password.trim())
      newErrors.password = "Password is required";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(password))
      newErrors.password = "Must contain 6+ chars, 1 uppercase, 1 lowercase, & 1 number";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (success) {
      navigate("/email-sent", { state: { email: email } });
    }
  }, [success, navigate, email]);

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const user: UserType = {
        name,
        username,
        email,
        password
      };
      signUp(user);
    }
  };

  return (
    <>
      <SEOHelmet
        title="Join HospitoFind"
        description="Sign up to access verified hospital data, save your favorite facilities, and contribute to the global healthcare directory."
      />

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

            <h2 className={style.welcome}>Join a Global Health Network</h2>
            <p className={style.tagline}>
              Gain instant access to verified hospital data, personalized health alerts, and a community dedicated to safe healthcare access.
            </p>

            <div className={style.features}>
              <div className={style.feature}>
                <div className={style.iconCircle}><MapPin size={20} /></div>
                <p>Locate Care Instantly</p>
              </div>
              <div className={style.feature}>
                <div className={style.iconCircle}><Globe size={20} /></div>
                <p>Worldwide Coverage</p>
              </div>
              <div className={style.feature}>
                <div className={style.iconCircle}><ShieldCheck size={20} /></div>
                <p>Data Privacy Guaranteed</p>
              </div>
            </div>
          </div>
        </section>

        <section className={style.right}>
          <div className={style.mobileLogo}>
            <img src={Logo} alt="HospitoFind" />
          </div>
          <div className={style.wrapper}>
            <div className={style.header}>
              <h1 className={style.title}>Create Your Profile</h1>
              <p className={style.subtitle}>
                Enter your details below to unlock full access to the platform.
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
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
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
                      placeholder="e.g. john_doe"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) setErrors({ ...errors, username: "" });
                      }}
                      className={`${style.form_input} ${errors.username ? style.invalid : ""}`}
                    />
                  </div>
                  {errors.username && <p className={style.form_error}>{errors.username}</p>}
                </div>

                <div className={`${style.form_group} ${style.fullWidth}`}>
                  <label htmlFor="email">Email Address</label>
                  <div className={style.inputWrapper}>
                    <Mail className={style.inputIcon} />
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
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
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: "" });
                      }}
                      className={`${style.form_input} ${errors.password ? style.invalid : ""}`}
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

                <div className={style.form_group}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className={style.inputWrapper}>
                    <Lock className={style.inputIcon} />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                      }}
                      className={`${style.form_input} ${errors.confirmPassword ? style.invalid : ""}`}
                    />
                    <button
                      type="button"
                      className={style.togglePassword}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className={style.form_error}>{errors.confirmPassword}</p>}
                </div>
              </div>

              <Button
                disabled={loading}
                className={style.form_button}
                type="submit"
              >
                {loading ? "Initializing Profile..." : "Create Free Account"}
                <ArrowRight className={style.arrowIcon} size={18} />
              </Button>
            </form>

            <div className={style.divider}>
              <span className={style.dividerText}>Or register using</span>
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
      <SimpleFooter />
    </>
  );
};

export default SignUp;