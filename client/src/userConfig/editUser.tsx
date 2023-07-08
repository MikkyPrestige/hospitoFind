import { useState } from "react";
import { useAuthContext } from "../contexts/userContext";
import { User } from "@/services/userTypes";
import useUpdate from "@/hooks/upDate";
import { Button } from "@/components/button";
import { FaUserEdit } from "react-icons/fa";
import btnStyle from "./style/logout.module.css";
import style from "./style/delete.module.css";
import UpdatePassword from "./editPassword";

const UpdateForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [profileDp, setProfileDp] = useState(null as File | null);
  const { loading, success, error, update } = useUpdate();
  const { state } = useAuthContext();
  const username: string = state.username || "";
  const placeholderName: string = state.name || "";
  const placeholderEmail: string = state.email || "";

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user: User = { name, username, email, password };
    update(user);
    setName("");
    setEmail("");
    setPassword("");
    // setProfileDp(null);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "name":
        setName(e.target.value);
        break;
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      // case "profileDp":
      //   if (e.target.files && e.target.files.length > 0) {
      //     setProfileDp(e.target.files[0]);
      //   }
      //   break;
    }
  }

  return (
    <div className={btnStyle.container}>
      <form onSubmit={handleUpdate} className={style.form}>
        <input
          type="text"
          placeholder={placeholderName}
          name="name"
          value={name}
          onChange={handleInput}
          className={style.input}
        />
        <input
          type="email"
          placeholder={placeholderEmail}
          name="email"
          value={email}
          onChange={handleInput}
          className={style.input}
        />
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          value={password}
          onChange={handleInput}
          className={style.input}
        />
        {/* <input
          type="file"
          name="profileDp"
          onChange={handleInput}
        /> */}
        {success && <p className={btnStyle.success}>{success}</p>}
        {error && <p className={btnStyle.error}>{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          children={loading ? "Updating..." : <span className={btnStyle.span}>Update<FaUserEdit className={btnStyle.icon} /></span>}
          className={btnStyle.btn}
        />
      </form>
      <UpdatePassword />
    </div>
  );
}

export default UpdateForm