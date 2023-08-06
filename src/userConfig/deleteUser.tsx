// import useDelete from "@/hooks/delete";
// import { useAuthContext } from "@/contexts/userContext";
// import { useState } from "react";
// import { Button } from "@/components/button";
// import style from "./style/delete.module.css";
// import btnStyle from "./style/logout.module.css";
// import { AiOutlineUserDelete } from "react-icons/ai";

// const DeleteBtn = () => {
//   const { loading, success, error, deleteUser } = useDelete();
//   const [inputPassword, setInputPassword] = useState<{ password: string }>({ password: "" });
//   const { state } = useAuthContext();
//   const user: string = state.username || "";
//   const password: string = inputPassword.password;

//   const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (user) {
//       deleteUser(user, password);
//     }
//     setInputPassword({ password: "" });
//   };

//   return (
//     <div className={style.container}>
//       <form onSubmit={handleDelete} className={style.form}>
//         <input
//           type="text"
//           placeholder="username"
//           className={style.input}
//           value={user}
//           disabled
//         />
//         <input
//           type="password"
//           placeholder="password"
//           value={inputPassword.password}
//           onChange={(e) => setInputPassword({ password: e.target.value })}
//           className={style.input}
//         />
//         {success && <p className={btnStyle.success}>{success}</p>}
//         {error && <p className={btnStyle.error}>{error}</p>}
//         <Button
//           type="submit"
//           disabled={loading}
//           children={loading ? "Deleting..." : <span className={btnStyle.span}>Delete<AiOutlineUserDelete className={btnStyle.icon} /></span>}
//           className={btnStyle.btn}
//         />
//       </form>
//     </div>
//   )
// }

// export default DeleteBtn