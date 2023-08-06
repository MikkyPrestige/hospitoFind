import useLogout from "@/hooks/logout";
import { IoMdLogOut } from "react-icons/io";
import { Button } from "../components/button";
import style from "../pages/profile/style/dashboard.module.css";

const Logout = () => {
  const { logout, loading, error } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={style.logout}>
      <Button
        onClick={handleLogout}
        disabled={loading}
        children={loading ? "Bye..." : <span className={style.span}><IoMdLogOut className={style.icon} /> Logout</span>}
        className={style.btn}
      />
      {error && <p className={style.error}>{error}</p>}
    </div>
  );
}

export default Logout