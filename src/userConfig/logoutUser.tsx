import useLogout from "@/hooks/logout";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Button } from "../components/button";
import style from "./style/style.module.css";

const Logout = () => {
  const { logout, loading, error } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={style.container}>
      <div className={style.box}>
        <AiOutlineExclamationCircle className={style.box_icon} />
        <h1 className={style.head}>Are you sure you want to log out?</h1>
        <p className={style.subhead}>You can always come back later!</p>
      </div>
      <Button
        onClick={handleLogout}
        disabled={loading}
        children={loading ? "Bye..." : <span className={style.span}>Yes, Log Me Out</span>}
        className={style.btn}
      />
      {error && <p className={style.error}>{error}</p>}
    </div>
  );
}

export default Logout