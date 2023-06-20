import React, { useState } from "react";
import { Link } from "react-router-dom";
import useSignUp from "@/hooks/signUp";
import { User } from "@/services/userTypes";
import { BG } from "@/components/background";
import { Button } from "@/components/button";
import style from "./style/signUp.module.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { loading, error, signUp } = useSignUp();

  // validate form
  const validateForm = () => {
    let errors: { [key: string]: string } = {};

    if (!name.trim()) {
      errors["name"] = "Please Enter your Name";
      return false
    }
    if (!username.trim()) {
      errors["username"] = "Username cannot be empty"
      return false
    }
    if (!email.trim()) {
      errors["email"] = "Please enter your email address"
      return false
    } else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      errors["email"] = "Email address is not valid"
      return false
    }
    if (!password.trim()) {
      errors["password"] = "Please Enter a Password"
      return false
    } else if (password.length < 6) {
      errors["password"] = "Password must be at least 6 characters"
      return false
    }
    if (!confirmPassword.trim()) {
      errors["confirmPassword"] = "Confirm password cannot be empty"
      return false
    } else if (password !== confirmPassword) {
      errors["confirmPassword"] = "Passwords do not match"
      return false
    }
    setErrors(errors)
    return true
  }

  const resetForm = () => {
    setName("")
    setUsername("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setErrors({})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    switch (name) {
      case "name":
        setName(value)
        break
      case "username":
        setUsername(value)
        break
      case "email":
        setEmail(value)
        break
      case "password":
        setPassword(value)
        break
      case "confirmPassword":
        setConfirmPassword(value)
        break
    }
  }

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return
    const user: User = { name, username, email, password };
    signUp(user);
    resetForm()
  };

  return (
    <section className={style.section}>
      <BG />
      <section className={style.wrapper}>
        <h2 className={style.title}>Create An Account</h2>
        <form onSubmit={handleSignUp} className={style.form}>
          <div className={style.form_group}>
            <label htmlFor="name" className={style.form_label}>Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              name="name"
              value={name}
              onChange={handleChange}
              className={style.form_input}
            />
            {
              errors["name"] && (
                <p className={style.form_error}>{errors["name"]}</p>
              )
            }
          </div>
          <div className={style.form_group}>
            <label htmlFor="username" className={style.form_label}>Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              name="username"
              value={username}
              onChange={handleChange}
              className={style.form_input}
            />
            {
              errors["username"] && (
                <p className={style.form_error}>{errors["username"]}</p>
              )
            }
          </div>
          <div className={style.form_group}>
            <label htmlFor="email" className={style.form_label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter Email Address"
              name="email"
              value={email}
              onChange={handleChange}
              className={style.form_input}
            />
            {
              errors["email"] && (
                <p className={style.form_error}>{errors["email"]}</p>
              )
            }
          </div>
          <div className={style.form_group}>
            <label htmlFor="password" className={style.form_label}>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              value={password}
              onChange={handleChange}
              className={style.form_input}
            />
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={style.svg}>
              <path d="M1 1.27L2.28 0L19 16.72L17.73 18L14.65 14.92C13.5 15.3 12.28 15.5 11 15.5C6 15.5 1.73 12.39 0 8C0.69 6.24 1.79 4.69 3.19 3.46L1 1.27ZM11 5C11.7956 5 12.5587 5.31607 13.1213 5.87868C13.6839 6.44129 14 7.20435 14 8C14.0005 8.34057 13.943 8.67873 13.83 9L10 5.17C10.3213 5.05698 10.6594 4.99949 11 5ZM11 0.5C16 0.5 20.27 3.61 22 8C21.1839 10.0732 19.7969 11.8727 18 13.19L16.58 11.76C17.9629 10.8034 19.0782 9.50906 19.82 8C19.0116 6.34994 17.7564 4.95977 16.1973 3.9875C14.6381 3.01524 12.8375 2.49988 11 2.5C9.91 2.5 8.84 2.68 7.84 3L6.3 1.47C7.74 0.85 9.33 0.5 11 0.5ZM2.18 8C2.98844 9.65006 4.24357 11.0402 5.80273 12.0125C7.36189 12.9848 9.16254 13.5001 11 13.5C11.69 13.5 12.37 13.43 13 13.29L10.72 11C10.0242 10.9254 9.37483 10.6149 8.87998 10.12C8.38513 9.62518 8.07458 8.97584 8 8.28L4.6 4.87C3.61 5.72 2.78 6.78 2.18 8Z" fill="#C1C1C1" />
            </svg>
            {
              errors["password"] && (
                <p className={style.form_error}>{errors["password"]}</p>
              )
            }
          </div>
          <div className={style.form_group}>
            <label htmlFor="confirmPassword" className={style.form_label}>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className={style.form_input}
            />
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={style.svg}>
              <path d="M1 1.27L2.28 0L19 16.72L17.73 18L14.65 14.92C13.5 15.3 12.28 15.5 11 15.5C6 15.5 1.73 12.39 0 8C0.69 6.24 1.79 4.69 3.19 3.46L1 1.27ZM11 5C11.7956 5 12.5587 5.31607 13.1213 5.87868C13.6839 6.44129 14 7.20435 14 8C14.0005 8.34057 13.943 8.67873 13.83 9L10 5.17C10.3213 5.05698 10.6594 4.99949 11 5ZM11 0.5C16 0.5 20.27 3.61 22 8C21.1839 10.0732 19.7969 11.8727 18 13.19L16.58 11.76C17.9629 10.8034 19.0782 9.50906 19.82 8C19.0116 6.34994 17.7564 4.95977 16.1973 3.9875C14.6381 3.01524 12.8375 2.49988 11 2.5C9.91 2.5 8.84 2.68 7.84 3L6.3 1.47C7.74 0.85 9.33 0.5 11 0.5ZM2.18 8C2.98844 9.65006 4.24357 11.0402 5.80273 12.0125C7.36189 12.9848 9.16254 13.5001 11 13.5C11.69 13.5 12.37 13.43 13 13.29L10.72 11C10.0242 10.9254 9.37483 10.6149 8.87998 10.12C8.38513 9.62518 8.07458 8.97584 8 8.28L4.6 4.87C3.61 5.72 2.78 6.78 2.18 8Z" fill="#C1C1C1" />
            </svg>
            {
              errors["confirmPassword"] && (
                <p className={style.form_error}>{errors["confirmPassword"]}</p>
              )
            }
          </div>
          {
            error && (
              <p className={style.form_error}>{error}</p>
            )
          }
          <Button disabled={loading} children={loading ? "Creating Account..." : "Create Account"} className={style.form_button} />
        </form>
        <p className={style.link}>Already have an account? <Link to="/login" className={style.login}>Login!</Link></p>
      </section>
    </section>
  );
}


export default SignUp