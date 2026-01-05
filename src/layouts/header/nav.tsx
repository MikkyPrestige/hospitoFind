import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { FiMenu, FiLogOut, FiLayout, FiShield, FiUser } from "react-icons/fi";
import Logo from "@/assets/images/logo.svg";
import style from "./style/nav.module.scss";
import { useAuthContext } from "@/context/userContext";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { state, dispatch } = useAuthContext();

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showMenu]);

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
            <li><NavLink to="/find-hospital" className={({ isActive }) => isActive ? style.active : ""}>Find Care</NavLink></li>
            <li><NavLink to="/directory" className={({ isActive }) => isActive ? style.active : ""}>Directory</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? style.active : ""}>About Us</NavLink></li>

            {state?.role === "admin" && (
              <li>
                <NavLink to="/admin" className={style.adminLink}>
                  <FiShield className={style.icon} /> Admin
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* ACTIONS*/}
        <div className={style.actions}>
          {state?.username ? (
            <div className={style.userProfile}>
              <Link to="/dashboard" className={style.profileTrigger}>
                <div className={style.avatar}>
                  <FiUser className={style.avatarIcon} />
                </div>
                <span className={style.userName}>{state.username}</span>
              </Link>
            </div>
          ) : (
            <div className={style.authButtons}>
              <Link to="/login" className={style.loginBtn}>Login</Link>
              <Link to="/signup" className={style.signupBtn}>Get Started</Link>
            </div>
          )}

          {/* MOBILE TOGGLE */}
          <button
            onClick={toggleMenu}
            className={style.mobileToggle}
            aria-label={showMenu ? "Close menu" : "Open menu"}
          >
            {showMenu ? <MdClose /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER (Slide-in) */}
      <div className={`${style.mobileDrawer} ${showMenu ? style.drawerOpen : ""}`}>
        <nav className={style.drawerNav}>
          <ul className={style.drawerLinks}>
            <li><NavLink to="/" onClick={toggleMenu}>Home</NavLink></li>
            <li><NavLink to="/find-hospital" onClick={toggleMenu}>Find Care</NavLink></li>
            <li><NavLink to="/directory" onClick={toggleMenu}>Directory</NavLink></li>
            <li><NavLink to="/about" onClick={toggleMenu}>About Us</NavLink></li>
            <li><NavLink to="/health-news" onClick={toggleMenu}>Health News</NavLink></li>
          </ul>

          <div className={style.drawerDivider}></div>

          <div className={style.drawerFooter}>
            {state?.username ? (
              <div className={style.drawerUser}>
                <div className={style.drawerUserInfo}>
                  <div className={style.bigAvatar}><FiUser /></div>
                  <div className={style.userDetails}>
                    <span className={style.uName}>{state.username}</span>
                    <span className={style.uRole}>{state.role || "Patient"}</span>
                  </div>
                </div>
                <div className={style.drawerUserActions}>
                  <Link to="/dashboard" onClick={toggleMenu} className={style.dashBtn}>
                    <FiLayout /> Dashboard
                  </Link>
                  {state?.role === "admin" && (
                    <Link to="/admin" onClick={toggleMenu} className={style.adminBtnMobile}>
                      <FiShield /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className={style.logoutBtn}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className={style.drawerAuth}>
                <Link to="/login" onClick={toggleMenu} className={style.mobileLogin}>Log In</Link>
                <Link to="/signup" onClick={toggleMenu} className={style.mobileSignup}>Create Free Account</Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;