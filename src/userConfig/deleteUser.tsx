import { useState } from "react";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useDelete from "@/hooks/user/delete";
import { useAuthContext } from "@/context/userContext";
import { Button } from "@/components/button";
import style from "./style/deleteUser.module.css";
import { toast } from "react-toastify";

const DeleteBtn = () => {
  const { state } = useAuthContext();
  const { loading, deleteUser } = useDelete();
  const [password, setPassword] = useState("");
  const [confirmUsername, setConfirmUsername] = useState("");
  const [showPassword, ] = useState(false);

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
      // deleteUser(state.username || "", password);
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
        {/* {!isSocial ? (
          <div className={style.wrapper}>
            <label className={style.subtitle}>Step 1: Verify Password</label>
            <div className={style.passwordBox} style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={style.input}
                placeholder="Enter your password"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>
        ) : (
          <div className={style.socialNotice}>
            <p><strong>Step 1:</strong> Authenticated via Social Login ✅</p>
          </div>
        )}

        <div className={style.wrapper}>
          <label className={style.subtitle}>
            Step {isSocial ? "1" : "2"}: Type <strong>{state.username}</strong> to confirm
          </label>
          <input
            type="text"
            value={confirmUsername}
            onChange={(e) => setConfirmUsername(e.target.value)}
            className={style.input}
            placeholder="Type your username here"
            required
            autoComplete="off"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || confirmUsername !== state.username}
          className={style.btn}
          style={{
            backgroundColor: '#FF033E',
            marginTop: '1rem',
            opacity: confirmUsername === state.username ? 1 : 0.6
          }}
        >
          {loading ? "Deleting..." : isSocial ? "Delete Social Account" : "Delete Account"}
        </Button> */}
      </form>
    </div>
  );
  // return (
  //   <div className={style.container}>
  //     <BsFillExclamationTriangleFill style={{ fill: "#FF033E", fontSize: "4rem" }} />
  //     <p className={style.subhead}>
  //       This action is <strong>permanent</strong>. To confirm, please follow the steps below.
  //     </p>

  //     <form onSubmit={handleDelete} className={style.form}>
  //       <div className={style.wrapper}>
  //         <label className={style.subtitle}>Step 1: Verify Password</label>
  //         <div className={style.passwordBox} style={{ position: 'relative' }}>
  //           <input
  //             type={showPassword ? "text" : "password"}
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             className={style.input}
  //             placeholder="Enter your password"
  //             required
  //           />
  //           <span
  //             onClick={() => setShowPassword(!showPassword)}
  //             style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
  //           >
  //             {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
  //           </span>
  //         </div>
  //       </div>

  //       <div className={style.wrapper}>
  //         <label className={style.subtitle}>
  //           Step 2: Type <strong>{state.username}</strong> to confirm
  //         </label>
  //         <input
  //           type="text"
  //           value={confirmUsername}
  //           onChange={(e) => setConfirmUsername(e.target.value)}
  //           className={style.input}
  //           placeholder="Type your username here"
  //           required
  //           autoComplete="off"
  //         />
  //       </div>

  //       <Button
  //         type="submit"
  //         disabled={loading}
  //         className={style.btn}
  //         style={{
  //           backgroundColor: '#FF033E',
  //           marginTop: '1rem',
  //           opacity: confirmUsername === state.username ? 1 : 0.6
  //         }}
  //       >
  //         {loading ? "Deleting..." : "Delete Account"}
  //       </Button>
  //     </form>
  //   </div>
  // );
};

export default DeleteBtn;