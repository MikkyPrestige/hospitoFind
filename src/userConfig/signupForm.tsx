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
import useSignUp from "@/hooks/signup";
import usePageTransition from "@/hooks/pageTransition";
import { User } from "@/services/user";
import { Button } from "@/components/button";
import { BG } from "@/components/bg";
import Header from "@/layouts/header/nav";
import style from "./style/scss/signup.module.css";
import img from "../assets/images/logo.svg";

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

    if (!name.trim()) newErrors.name = "Please enter your name";
    if (!username.trim()) newErrors.username = "Please enter a username";
    if (!email.trim()) newErrors.email = "Please enter your email address";
    else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      newErrors.email = "Email address is not valid";
    if (!password.trim())
      newErrors.password = "Please enter a password";
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
    const user: User = { name, username, email, password };
    if (validateForm()) signUp(user);
  };

  return (
    <>
      <Header />
      <section className={`${style.section} ${style[transitionClass]}`}>
        <BG />
        <div className={style.loginContainer}>
          <div className={style.imageSection}>
            <img
              src={img}
              alt="HospitoFind Logo"
              className={style.image}
            />
            <h2 className={style.tagline}>
              “Join HospitoFind to help others discover trusted healthcare near them.”
            </h2>
          </div>

          <section className={`${style.wrapper} ${style.signup}`}>
            <h1 className={`${style.title} ${style.signupTitle}`}>
              Create Your HospitoFind Account
            </h1>
            <p className={style.subtitle}>
              Join our community of healthcare explorers
            </p>

            <div className={style.socialBtn}>
              <button
                onClick={() => loginWithRedirect()}
                className={style.social}
              >
                <FcGoogle className={style.icon} />
              </button>
              <button
                onClick={() => loginWithRedirect()}
                className={style.social}>
                <FaFacebook className={style.icon} />
              </button>
              <button
                onClick={() => loginWithRedirect()}
                className={style.social}>
                <FaTwitter className={style.icon} />
              </button>
              <button
                onClick={() => loginWithRedirect()}
                className={style.social}>
                <FaLinkedin className={style.icon} />
              </button>
            </div>

            <h3 className={style.or}>or sign up with email</h3>

            <form onSubmit={handleSignUp} className={style.form}>
              <div className={style.form_group}>
                <label htmlFor="name" className={style.form_label}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  placeholder="Enter full name"
                  onChange={(e) => setName(e.target.value)}
                  className={style.form_input}
                />
                {errors.name && (
                  <p className={style.form_error}>{errors.name}</p>
                )}
              </div>

              <div className={style.form_group}>
                <label htmlFor="username" className={style.form_label}>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  placeholder="Enter username"
                  onChange={(e) => setUsername(e.target.value)}
                  className={style.form_input}
                />
                {errors.username && (
                  <p className={style.form_error}>{errors.username}</p>
                )}
              </div>

              <div className={style.form_group}>
                <label htmlFor="email" className={style.form_label}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  placeholder="Enter email address"
                  onChange={(e) => setEmail(e.target.value)}
                  className={style.form_input}
                />
                {errors.email && (
                  <p className={style.form_error}>{errors.email}</p>
                )}
              </div>

              <div className={style.form_group}>
                <label htmlFor="password" className={style.form_label}>
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  className={style.form_input}
                />
                <span
                  className={style.form_password}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
                {errors.password && (
                  <p className={style.form_error}>{errors.password}</p>
                )}
              </div>

              <div className={style.form_group}>
                <label
                  htmlFor="confirmPassword"
                  className={style.form_label}
                >
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={style.form_input}
                />
                <span
                  className={style.form_password}
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? (
                    <FaRegEyeSlash />
                  ) : (
                    <FaRegEye />
                  )}
                </span>
                {errors.confirmPassword && (
                  <p className={style.form_error}>
                    {errors.confirmPassword}
                  </p>
                )}
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
                  loading ? "Creating Account..." : "Create Account"
                }
                className={style.form_button}
              />
            </form>

            <p className={style.link}>
              Already have an account?{" "}
              <Link to="/login" className={style.login}>
                Login
              </Link>
            </p>
          </section>
        </div>
      </section>
    </>
  );
};

export default SignUp;
// import { Link } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react"
// import { FcGoogle } from "react-icons/fc"
// import { FaFacebook, FaTwitter, FaLinkedin, FaRegEyeSlash, FaRegEye } from "react-icons/fa"
// import useSignUp from "@/hooks/signup";
// import { User } from "@/services/user";
// import { Button } from "@/components/button";
// import { BG } from "@/components/bg";
// import Header from "@/layouts/header/nav";
// import style from "./style/scss/signup.module.css";

// const SignUp = () => {
//   const [name, setName] = useState("");
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const { loading, error, signUp } = useSignUp();
//   const { loginWithRedirect } = useAuth0();

//   // validate form
//   const validateForm = () => {
//     let errors: { [key: string]: string } = {};
//     let valid = true;

//     if (!name.trim()) {
//       errors["name"] = "Please enter your Name";
//       valid = false;
//     }
//     if (!username.trim()) {
//       errors["username"] = "Please enter a Username"
//       valid = false
//     }
//     if (!email.trim()) {
//       errors["email"] = "Please enter your Email Address"
//       valid = false
//     } else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
//       errors["email"] = "Email Address is not valid"
//       valid = false
//     }
//     if (!password.trim()) {
//       errors["password"] = "Please enter a Password"
//       valid = false
//     } else if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
//       errors["password"] = "Password must contain at least 6 characters, including UPPER/lowercase and numbers"
//       valid = false
//     }
//     if (!confirmPassword.trim()) {
//       errors["confirmPassword"] = "Confirm password cannot be empty"
//       valid = false
//     } else if (!confirmPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
//       errors["confirmPassword"] = "Password must contain at least 6 characters, including UPPER/lowercase and numbers"
//       valid = false
//     } else if (password !== confirmPassword) {
//       errors["confirmPassword"] = "Passwords do not match"
//       valid = false
//     }
//     setErrors(errors)
//     return valid
//   }

//   const resetForm = () => {
//     setName("")
//     setUsername("")
//     setEmail("")
//     setPassword("")
//     setConfirmPassword("")
//     setErrors({})
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     switch (name) {
//       case "name":
//         setName(value)
//         break
//       case "username":
//         setUsername(value)
//         break
//       case "email":
//         setEmail(value)
//         break
//       case "password":
//         setPassword(value)
//         break
//       case "confirmPassword":
//         setConfirmPassword(value)
//         break
//     }
//   }

//   const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const user: User = { name, username, email, password };
//     if (validateForm()) {
//       signUp(user);
//       resetForm();
//     }
//   };

//   return (
//     <>
//       <Header />
//       <section className={style.section}>
//         <BG />
//         <section className={style.wrapper}>
//           <h2 className={style.title}>Create An Account</h2>
//           <h2 className={style.socialBtn}>Sign up with
//             <button onClick={() => loginWithRedirect()} className={style.social}>
//               <FcGoogle className={style.icon} />
//               <FaFacebook className={style.icon} />
//               <FaTwitter className={style.icon} />
//               <FaLinkedin className={style.icon} />
//             </button>
//           </h2>
//           <h3 className={style.or}>or</h3>
//           <form onSubmit={handleSignUp} className={style.form}>
//             <div className={style.form_group}>
//               <label htmlFor="name" className={style.form_label}>Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 id="name"
//                 placeholder="Enter Name"
//                 value={name}
//                 onChange={handleChange}
//                 className={style.form_input}
//               />
//               {errors["name"] && (<p className={style.form_error}>{errors["name"]}</p>)}
//             </div>
//             <div className={style.form_group}>
//               <label htmlFor="username" className={style.form_label}>Username</label>
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 autoComplete="username"
//                 placeholder="Enter Username"
//                 value={username}
//                 onChange={handleChange}
//                 className={style.form_input}
//               />
//               {errors["username"] && (<p className={style.form_error}>{errors["username"]}</p>)}
//             </div>
//             <div className={style.form_group}>
//               <label htmlFor="email" className={style.form_label}>Email Address</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 autoComplete="email"
//                 placeholder="Enter Email Address"
//                 value={email}
//                 onChange={handleChange}
//                 className={style.form_input}
//               />
//               {errors["email"] && (<p className={style.form_error}>{errors["email"]}</p>)}
//             </div>
//             <div className={style.form_group}>
//               <label htmlFor="password" className={style.form_label}>Password</label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 name="password"
//                 autoComplete="new-password"
//                 placeholder="Enter Password"
//                 value={password}
//                 onChange={handleChange}
//                 className={style.form_input}
//               />
//               <span className={style.form_password} onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
//               </span>
//               {errors["password"] && (<p className={style.form_error}>{errors["password"]}</p>)}
//             </div>
//             <div className={style.form_group}>
//               <label htmlFor="confirmPassword" className={style.form_label}>Confirm Password</label>
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 autoComplete="new-password"
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={handleChange}
//                 className={style.form_input}
//               />
//               <span className={style.form_password} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                 {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
//               </span>
//               {errors["confirmPassword"] && (<p className={style.form_error}>{errors["confirmPassword"]}</p>)}
//             </div>
//             {error && (<p className={style.form_error}>{error}</p>)}
//             <Button disabled={loading} children={loading ? "Creating Account..." : "Create Account"} className={style.form_button} />
//           </form>
//           <p className={style.link}>Already have an account? <Link to="/login" className={style.login}>Login!</Link></p>
//         </section>
//       </section>
//     </>
//   );
// }


// export default SignUp