import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { FiMenu, FiLogOut, FiLayout } from "react-icons/fi";
import Logo from "@/assets/images/logo.svg";
import style from "./style/nav.module.scss";
import { useAuthContext } from "@/context/userContext";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { state, dispatch } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    setShowMenu(false);
  };

  return (
    <header className={`${style.header} ${scrolled ? style.scrolled : ""}`}>
      <div className={style.container}>
        <Link to="/" className={style.logoWrapper} onClick={() => setShowMenu(false)}>
          <img src={Logo} alt="HospitoFind Logo" className={style.logo} />
        </Link>

        <nav className={style.desktopNav}>
          <ul className={style.navLinks}>
            <li><NavLink to="/find-hospital" className={({ isActive }) => isActive ? style.active : ""}>Find a Hospital</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? style.active : ""}>About Us</NavLink></li>
            <li><NavLink to="/directory" className={({ isActive }) => isActive ? style.active : ""}>Directory</NavLink></li>
          </ul>
        </nav>

        <div className={style.actions}>
          {state.username ? (
            <div className={style.userProfile}>
              <Link to="/dashboard" className={style.profileTrigger}>
                <div className={style.avatar}>
                  {state.username.charAt(0).toUpperCase()}
                </div>
                <span className={style.userName}>{state.username}</span>
              </Link>
            </div>
          ) : (
            <div className={style.authButtons}>
              <Link to="/login" className={style.loginBtn}>Login</Link>
              <Link to="/signup" className={style.signupBtn}>Sign Up</Link>
            </div>
          )}

          <button
            onClick={toggleMenu}
            className={style.mobileToggle}
            aria-label={showMenu ? "Close menu" : "Open menu"}
          >
            {showMenu ? (
              <MdClose className={style.toggle_icon} />
            ) : (
              <FiMenu className={style.toggle_icon} />
            )}
          </button>
        </div>
      </div>

      <div className={`${style.mobileDrawer} ${showMenu ? style.drawerOpen : ""}`}>
        <nav className={style.drawerNav}>
          <ul className={style.drawerLinks}>
            <li><NavLink to="/find-hospital" onClick={toggleMenu}>Find a Hospital</NavLink></li>
            <li><NavLink to="/about" onClick={toggleMenu}>About Us</NavLink></li>
            <li><NavLink to="/directory" onClick={toggleMenu}>Directory</NavLink></li>

            <div className={style.drawerDivider}></div>

            {state.username ? (
              <>
                <li><Link to="/dashboard" onClick={toggleMenu}><FiLayout /> Dashboard</Link></li>
                <li><button onClick={handleLogout} className={style.logoutBtn}><FiLogOut /> Logout</button></li>
              </>
            ) : (
              <div className={style.drawerAuth}>
                <Link to="/login" onClick={toggleMenu} className={style.mobileLogin}>Login</Link>
                <Link to="/signup" onClick={toggleMenu} className={style.mobileSignup}>Create Account</Link>
              </div>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;