import { useState } from "react";
import { User } from "@/services/user";
import { useAuthContext } from "@/context/userContext";
import useUpdate from "@/hooks/user/update";
import { Button } from "@/components/button";
import style from "./style/updateUser.module.css";

interface UpdateUserProps {
  onSuccess?: () => void;
}

const UpdateUser = ({ onSuccess }: UpdateUserProps) => {
  const { state } = useAuthContext();
  const { loading, update } = useUpdate();

  const [formData, setFormData] = useState({
    name: state.name || "",
    email: state.email || "",
    password: ""
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userUpdate: User = {
      ...formData,
      username: state.username || "",
      role: state.role || "user"
    };
    update(userUpdate, onSuccess);
    setFormData(prev => ({ ...prev, password: "" }));
  };

  return (
    <section className={style.section}>
      <form onSubmit={handleUserUpdate} className={style.form}>
        <div className={style.wrapper}>
          <p className={style.subtitle}>Full Name</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInput}
            className={style.input}
            placeholder="Change your name"
          />
        </div>
        <div className={style.wrapper}>
          <p className={style.subtitle}>Email Address</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInput}
            className={style.input}
            placeholder="Change your email"
          />
        </div>
        <div className={style.wrapper}>
          <p className={style.subtitle}>Confirm with Password</p>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInput}
            className={style.input}
            placeholder="Enter current password to save changes"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className={style.btn2}
        >
          {loading ? "Saving..." : "Update Profile"}
        </Button>
      </form>
    </section>
  );
}

export default UpdateUser;