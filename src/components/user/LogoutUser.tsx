import { useNavigate } from "react-router-dom";
import useLogout from "@/hooks/useLogout";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Button } from "@/components/ui/Button";
import style from "./styles/logoutUser.module.css";

const Logout = () => {
  const { logout, loading } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className={style.container}>
      <div className={style.logoutCard}>
        <div className={style.iconWrapper}>
          <AiOutlineExclamationCircle className={style.box_icon} />
        </div>

        <div className={style.textContent}>
          <h1 className={style.head}>Ready to log out?</h1>
          <p className={style.subhead}>
            Sign in anytime to continue exploring <strong>HospitoFind</strong>.
          </p>
        </div>

        <div className={style.actionGroup}>
          <Button
            onClick={handleLogout}
            disabled={loading}
            className={style.confirmBtn}
          >
            {loading ? "Signing out..." : "Confirm Log Out"}
          </Button>

          <button
            onClick={handleCancel}
            className={style.cancelBtn}
            disabled={loading}
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
    // <div className={style.container}>
    //   <div className={style.box}>
    //     <AiOutlineExclamationCircle className={style.box_icon} />
    //     <h1 className={style.head}>Ready to log out?</h1>
    //     <p className={style.subhead}>
    //       Sign in anytime to continue exploring HospitoFind.
    //     </p>
    //   </div>

    //   <Button
    //     onClick={handleLogout}
    //     disabled={loading}
    //     className={style.btn}
    //   >
    //     {loading ? "See you soon!" : "Confirm Log Out"}
    //   </Button>
    // </div>
  );
}

export default Logout;