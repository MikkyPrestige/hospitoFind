import { useState, useEffect } from "react";
import { User } from "@/src/types/user";
import { useAuthContext } from "@/context/UserProvider";
import useUpdate from "@/hooks/useUpdateUser";
import { Button } from "@/components/ui/Button";
import style from "./styles/updateUser.module.css";

interface UpdateUserProps {
  onSuccess?: () => void;
}

const UpdateUser = ({ onSuccess }: UpdateUserProps) => {
  const { state } = useAuthContext();
  const { loading, update } = useUpdate();
  const [isDirty, setIsDirty] = useState(false);

  const [formData, setFormData] = useState({
    name: state.name || "",
    email: state.email || "",
    password: ""
  });

  useEffect(() => {
    const hasChanges =
      formData.name !== (state.name || "") ||
      formData.email !== (state.email || "");
    setIsDirty(hasChanges);
  }, [formData, state.name, state.email]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({
      name: state.name || "",
      email: state.email || "",
      password: ""
    });
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
      <div className={style.editCard}>
        {/* <h3 className={style.cardTitle}>Edit Profile</h3> */}
        <form onSubmit={handleUserUpdate} className={style.form}>
          <div className={style.field}>
            <label className={style.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInput}
              className={style.input}
              placeholder="Elue Michael"
              autoComplete="name"
            />
          </div>

          <div className={style.field}>
            <label className={style.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInput}
              className={style.input}
              placeholder="zero@hospitofind.com"
              autoComplete="email"
            />
          </div>

          <div className={style.field}>
            <label className={style.label}>Confirm with Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInput}
              className={`${style.input} ${style.passwordInput}`}
              placeholder="Enter current password to save changes"
              required
            />
          </div>

          <div className={style.actionArea}>
            <Button
              type="submit"
              disabled={loading || !isDirty || !formData.password}
              className={style.updateBtn}
            >
              {loading ? "Saving Changes..." : "Update Profile"}
            </Button>

            <button
              type="button"
              onClick={handleCancel}
              className={style.cancelBtn}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
    // <section className={style.section}>
    //   <form onSubmit={handleUserUpdate} className={style.form}>
    //     <div className={style.wrapper}>
    //       <p className={style.subtitle}>Full Name</p>
    //       <input
    //         type="text"
    //         name="name"
    //         value={formData.name}
    //         onChange={handleInput}
    //         className={style.input}
    //         placeholder="Change your name"
    //       />
    //     </div>
    //     <div className={style.wrapper}>
    //       <p className={style.subtitle}>Email Address</p>
    //       <input
    //         type="email"
    //         name="email"
    //         value={formData.email}
    //         onChange={handleInput}
    //         className={style.input}
    //         placeholder="Change your email"
    //       />
    //     </div>
    //     <div className={style.wrapper}>
    //       <p className={style.subtitle}>Confirm with Password</p>
    //       <input
    //         type="password"
    //         name="password"
    //         value={formData.password}
    //         onChange={handleInput}
    //         className={style.input}
    //         placeholder="Enter current password to save changes"
    //         required
    //       />
    //     </div>
    //     <Button
    //       type="submit"
    //       disabled={loading}
    //       className={style.btn2}
    //     >
    //       {loading ? "Saving..." : "Update Profile"}
    //     </Button>
    //   </form>
    // </section>
  );
}

export default UpdateUser;