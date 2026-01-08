import { useState } from "react";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import useDelete from "@/hooks/useDeleteUser";
import { useAuthContext } from "@/context/UserProvider";
import { Button } from "@/components/ui/Button";
import style from "./styles/deleteUser.module.css";
import { toast } from "react-toastify";

const DeleteBtn = () => {
  const { state } = useAuthContext();
  const { loading, deleteUser } = useDelete();
  const [password, setPassword] = useState("");
  const [confirmUsername, setConfirmUsername] = useState("");
  const [showPassword,] = useState(false);

  const isSocial = !!state.auth0Id;

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSocial && password.length < 6) {
      toast.warn("Please enter your full password.", { position: "top-center" });
      return;
    }

    if (confirmUsername !== state.username) {
      toast.error(`Confirmation failed. You must type "${state.username}" correctly.`, {
        position: "top-center"
      });
      return;
    }

    if (window.confirm("FINAL WARNING: This will permanently delete your account. Proceed?")) {
      deleteUser(state.username!, isSocial ? undefined : password)
    }
  };

  return (
    <div className={style.container}>
      <BsFillExclamationTriangleFill style={{ fill: "#FF033E", fontSize: "4rem" }} />
      <p className={style.subhead}>
        This action is <strong>permanent</strong>. To confirm, please follow the steps below.
      </p>

      <form onSubmit={handleDelete} className={style.form}>
        {!isSocial && (
          <div className={style.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={style.minimalInput}
              placeholder="Confirm Password"
              required
            />
          </div>
        )}

        <div className={style.confirmWrapper}>
          <p className={style.instruction}>
            Type <span className={style.usernameHighlight}>{state.username}</span> to continue:
          </p>
          <input
            type="text"
            value={confirmUsername}
            onChange={(e) => setConfirmUsername(e.target.value)}
            className={style.minimalInput}
            placeholder="Username"
            required
            autoComplete="off"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || confirmUsername !== state.username}
          className={style.dangerBtn}
        >
          {loading ? "Deleting..." : "Permanently Delete"}
        </Button>
      </form>
    </div>
  );
};

export default DeleteBtn;