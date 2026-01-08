import useLogout from "@/hooks/useLogout";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Button } from "@/components/ui/Button";
import style from "./styles/logoutUser.module.css";

const Logout = () => {
  const { logout, loading } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={style.container}>
      <div className={style.box}>
        <AiOutlineExclamationCircle className={style.box_icon} />
        <h1 className={style.head}>Ready to log out?</h1>
        <p className={style.subhead}>
          Sign in anytime to continue exploring HospitoFind.
        </p>
      </div>

      <Button
        onClick={handleLogout}
        disabled={loading}
        className={style.btn}
      >
        {loading ? "See you soon!" : "Confirm Log Out"}
      </Button>
    </div>
  );
}

export default Logout;