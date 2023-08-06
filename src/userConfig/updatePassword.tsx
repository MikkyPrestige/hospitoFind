// import usePasswordUpdate from "@/hooks/updatePassword";
// import { useAuthContext } from "@/contexts/userContext";
// import { useState } from "react";
// import { Button } from "@/components/button";
// import { FaExpeditedssl } from "react-icons/fa";
// import btnStyle from "./style/logout.module.css";
// import style from "./style/delete.module.css";

// const UpdatePassword = () => {
//   const [inputPassword, setInputPassword] = useState<{ password: string }>({ password: "" });
//   const [inputNewPassword, setInputNewPassword] = useState<{ newPassword: string }>({ newPassword: "" });
//   const { loading, success, error, updatePassword } = usePasswordUpdate();
//   const { state } = useAuthContext();
//   const username: string = state.username || "";
//   const password: string = inputPassword.password;
//   const newPassword: string = inputNewPassword.newPassword;

//   const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const user = { username, password, newPassword };
//     updatePassword(user);
//     setInputPassword({ password: "" });
//     setInputNewPassword({ newPassword: "" });
//   };

//   return (
//     <>
//       <form onSubmit={handleUpdate} className={style.form}>
//         <h1 className={btnStyle.success}>Change Password</h1>
//         {/* <input
//           type="text"
//           placeholder="username"
//           value={username}
//           disabled
//           className={style.input}
//         /> */}
//         <input
//           type="password"
//           placeholder="old password"
//           value={inputPassword.password}
//           onChange={(e) => setInputPassword({ password: e.target.value })}
//           className={style.input}
//         />
//         <input
//           type="password"
//           placeholder="new password"
//           value={inputNewPassword.newPassword}
//           onChange={(e) => setInputNewPassword({ newPassword: e.target.value })}
//           className={style.input}
//         />
//         {success && <p className={btnStyle.success}>{success}</p>}
//         {error && <p className={btnStyle.error}>{error}</p>}
//         <Button
//           type="submit"
//           disabled={loading}
//           children={loading ? "Updating..." : <span className={btnStyle.span}>Update<FaExpeditedssl className={btnStyle.icon} /></span>}
//           className={btnStyle.btn}
//         />
//       </form>
//     </>
//   )
// }

// export default UpdatePassword