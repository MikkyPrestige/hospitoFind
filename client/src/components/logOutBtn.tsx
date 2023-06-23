import useLogout from "@/hooks/logOut";
import { IoMdLogOut } from "react-icons/io";
import style from "./style/logout.module.css";
import { Button } from "./button";

const Logout = () => {
  const { logout, loading, error } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={style.container}>
      <Button
        onClick={handleLogout}
        disabled={loading}
        children={loading ? "Bye..." : <span className={style.span}><IoMdLogOut className={style.icon} /> Logout</span>}
        className={style.btn}
      />
      {error && <p>{error}</p>}
    </div>
  );
}

export default Logout