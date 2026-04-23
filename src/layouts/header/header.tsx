import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { FiMenu, FiLogOut, FiLayout, FiShield, FiUser } from "react-icons/fi";
import Logo from "@/assets/images/logo.svg";
import { useAuthContext } from "@/context/UserProvider";
import ThemeToggle from "@/components/ui/ThemeToggle"
import GoogleTranslate from "@/components/ui/GoogleTranslate";
import style from "./styles/scss/nav.module.scss";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { state, dispatch } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
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
        <div className={style.leftSection}>
          <Link to="/" className={style.logoWrapper} onClick={() => setShowMenu(false)}>
            <img src={Logo} alt="HospitoFind" className={style.logo} />
          </Link>

          <nav className={style.desktopNav}>
            <ul className={style.navLinks}>
              <li><NavLink to="/find-hospital" className={({ isActive }) => isActive ? style.active : ""}>Find Care</NavLink></li>
              <li><NavLink to="/directory" className={({ isActive }) => isActive ? style.active : ""}>Directory</NavLink></li>
              <li><NavLink to="/about" className={({ isActive }) => isActive ? style.active : ""}>About Us</NavLink></li>
            </ul>
          </nav>
        </div>

        <div className={style.actions}>
          <div className={style.desktopUtilities}>
            <GoogleTranslate />
            <ThemeToggle />
          </div>

          <div className={style.authWrapper}>
            {state?.username ? (
              <div className={style.userProfile}>
                <Link to="/dashboard" className={style.profileTrigger}>
                  <div className={style.avatar}><FiUser /></div>
                  <span className={style.userName}>{state.username}</span>
                </Link>
              </div>
            ) : (
              <div className={style.authButtons}>
                <Link to="/login" className={style.loginBtn}>Login</Link>
                <Link to="/signup" className={style.signupBtn}>Get Started</Link>
              </div>
            )}
          </div>

          <button onClick={toggleMenu} className={style.mobileToggle} aria-label="Toggle Menu">
            {showMenu ? <MdClose /> : <FiMenu />}
          </button>
        </div>
      </div>

      <div className={`${style.mobileDrawer} ${showMenu ? style.drawerOpen : ""}`}>
        <ul className={style.drawerLinks}>
          <li><NavLink to="/" onClick={toggleMenu}>Home</NavLink></li>
          <li><NavLink to="/find-hospital" onClick={toggleMenu}>Find Care</NavLink></li>
          <li><NavLink to="/directory" onClick={toggleMenu}>Directory</NavLink></li>
          <li><NavLink to="/about" onClick={toggleMenu}>About Us</NavLink></li>
        </ul>

        <div className={style.mobileUtilities}>
          <div className={style.utilityItem}>
            <span>Appearance</span>
            <ThemeToggle />
          </div>
          <div className={style.utilityItem}>
            <span>Language</span>
            <GoogleTranslate />
          </div>
        </div>

        <div className={style.drawerFooter}>
          {state?.username ? (
            <div className={style.drawerUserCard}>
              <div className={style.userInfo}>
                <div className={style.userAvatar}><FiUser /></div>
                <div className={style.userMeta}>
                  <p className={style.uName}>{state.username}</p>
                  <p className={style.uRole}>{state.role || "User"}</p>
                </div>
              </div>
              <div className={style.userActions}>
                <Link to="/dashboard" onClick={toggleMenu}><FiLayout /> Dashboard</Link>
                {state?.role === "admin" && (
                  <Link to="/admin" onClick={toggleMenu} className={style.adminBtn}><FiShield /> Admin Panel</Link>
                )}
                <button onClick={handleLogout} className={style.logoutBtn}><FiLogOut /> Sign Out</button>
              </div>
            </div>
          ) : (
            <div className={style.drawerAuth}>
              <Link to="/signup" onClick={toggleMenu} className={style.mobileSignup}>Get Started — Free</Link>
              <Link to="/login" onClick={toggleMenu} className={style.mobileLogin}>Login to your account</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;