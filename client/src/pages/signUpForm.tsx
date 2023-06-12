import React, { useState } from "react";
import useSignUp from "@/hooks/signUp";
import { User } from "@/services/userTypes";
import { useAuthContext } from "@/contexts/userContext";
import Logout from "./logOutBtn";

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("")
  const { loading, error, signUp } = useSignUp();
  const { state } = useAuthContext();

  // validate form
  const validateForm = () => {
    if (name === "") {
      setErrors("Name cannot be empty")
      return false
    }
    if (username === "") {
      setErrors("Username cannot be empty")
      return false
    }
    if (email === "") {
      setErrors("Email cannot be empty")
      return false
    } else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setErrors("Email is not valid")
      return false
    }
    if (password === "") {
      setErrors("Password cannot be empty")
      return false
    } else if (password.length < 6) {
      setErrors("Password must be at least 6 characters")
      return false
    }
    if (confirmPassword === "") {
      setErrors("Confirm password cannot be empty")
      return false
    } else if (password !== confirmPassword) {
      setErrors("Passwords do not match")
      return false
    }
    return true
  }

  const resetForm = () => {
    setName("")
    setUsername("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setErrors("")
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
    <div>
      {state.user && <p>{state.user}</p>}
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="name"
          name="name"
          value={name}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="username"
          name="username"
          value={username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="confirm password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Welcome..." : "Sign Up"}
        </button>
      </form>
      <Logout />
      {errors && <p>{errors}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}


export default SignUp