import useDelete from "@/hooks/delete";
import { useState } from "react";

const DeleteBtn = () => {
  const { loading, error, deleteUser } = useDelete();
  const [inputPassword, setInputPassword] = useState<{ password: string }>({ password: "" });

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = localStorage.getItem("user");
    if (user) {
      deleteUser(user, inputPassword.password);
    }
  };

  return (
    <div>
      <form onSubmit={handleDelete}>
        <input
          type="password"
          placeholder="password"
          value={inputPassword.password}
          onChange={(e) => setInputPassword({ password: e.target.value })}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  )
}

export default DeleteBtn
