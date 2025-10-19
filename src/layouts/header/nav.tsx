import { Link, NavLink, NavLinkProps, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
import { TbHomeHeart } from "react-icons/tb";
import Logo from "@/assets/images/logo.svg";
import { FcAbout } from "react-icons/fc";
import { FaSearchPlus } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { Avatar } from "@/components/avatar";
import style from "./style/nav.module.css";
import { useAuthContext } from "@/context/userContext";
import useLogout from "@/hooks/logout";

interface NavLinksProps extends NavLinkProps {
  to: string;
}

export const NavLinks = ({ to, ...props }: NavLinksProps) => {
  const active = { color: "#08299B" };
  const pending = { color: "#000" };
  return (
    <NavLink
      to={to}
      style={({ isActive, isPending }) =>
        isPending ? pending : isActive ? active : pending
      }
      {...props}
    />
  );
};

const Logout = () => {
  const { logout, loading, error } = useLogout();

  return (
    <div>
      <button onClick={logout} disabled={loading} className={style.logout}>
        {loading ? (
          "Bye..."
        ) : (
          <span className={style.smallSpan}>
            <IoMdLogOut className={style.smallIcon} /> Logout
          </span>
        )}
      </button>
      {error && <p className={style.error}>{error}</p>}
    </div>
  );
};

const LayoutMobile = () => {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu((s) => !s);
  const navigate = useNavigate();
  const { state } = useAuthContext();

  const handleLoginClick = () => {
    navigate(state.username ? "/dashboard" : "/login");
    setShowMenu(false);
  };

  const handleSignUpClick = () => {
    navigate(state.username ? "/dashboard" : "/signup");
    setShowMenu(false);
  };

  return (
    <header className={style.smallHeader}>
      <Link to="/" className={style.smallLogo}>
        <Avatar
          image={Logo}
          alt="logo"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            mixBlendMode: "color-burn",
          }}
        />
      </Link>

      <button onClick={toggleMenu} className={style.toggle}>
        {showMenu ? (
          <MdClose className={style.toggle_icon} />
        ) : (
          <FiMenu className={style.toggle_icon} />
        )}
      </button>

      {/* Overlay for fade background when menu is open */}
      {showMenu && <div className={style.overlay} onClick={toggleMenu}></div>}

      <nav className={`${style.smallNav} ${showMenu ? style.show : ""}`}>
        <ul className={style.smallList}>
          <li>
            <TbHomeHeart className={style.smallIcon} />
            <NavLinks to="/" onClick={toggleMenu} className={style.smallLink}>
              Home
            </NavLinks>
          </li>
          <li>
            <FcAbout className={style.smallIcon} />
            <NavLinks to="/about" onClick={toggleMenu} className={style.smallLink}>
              About
            </NavLinks>
          </li>
          <li>
            <FaSearchPlus className={style.smallIcon} />
            <NavLinks to="/find" onClick={toggleMenu} className={style.smallLink}>
              Find Hospital
            </NavLinks>
          </li>
          <li>
            <VscAccount className={style.smallIcon} />
            <NavLink to="/dashboard" className={style.smallLink} onClick={toggleMenu}>
              Dashboard
            </NavLink>
          </li>
        </ul>

        <div className={style.smallWrapper}>
          {state.username ? (
            <Logout />
          ) : (
            <>
              <button onClick={handleLoginClick} className={style.smallAuth}>
                Login
              </button>
              <button onClick={handleSignUpClick} className={style.smallAuth}>
                Signup
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

const LayoutLarge = () => {
  const navigate = useNavigate();
  const { state } = useAuthContext();

  const handleLoginClick = () =>
    navigate(state.username ? "/dashboard" : "/login");
  const handleSignUpClick = () =>
    navigate(state.username ? "/dashboard" : "/signup");

  return (
    <header className={style.large}>
      <Link to="/" className={style.largeLogo}>
        <Avatar
          image={Logo}
          alt="logo"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            mixBlendMode: "color-burn",
          }}
        />
      </Link>

      <nav className={style.largeNav}>
        <ul className={style.largeList}>
          <li>
            <TbHomeHeart className={style.largeIcon} />
            <NavLinks to="/" className={style.largeLink}>
              Home
            </NavLinks>
          </li>
          <li>
            <FcAbout className={style.largeIcon} />
            <NavLinks to="/about" className={style.largeLink}>
              About
            </NavLinks>
          </li>
          <li>
            <FaSearchPlus className={style.largeIcon} />
            <NavLinks to="/find" className={style.largeLink}>
              Find Hospital
            </NavLinks>
          </li>
          <li>
            <VscAccount className={style.largeIcon} />
            <NavLink to="/dashboard" className={style.largeLink}>
              Dashboard
            </NavLink>
          </li>
        </ul>

        <div className={style.largeWrapper}>
          {state.username ? (
            <Logout />
          ) : (
            <>
              <button onClick={handleLoginClick} className={style.largeAuth}>
                Login
              </button>
              <button onClick={handleSignUpClick} className={style.largeAuth}>
                Signup
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50); // threshold for effect
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${scrolled ? style.scrolled : ""}`}>
      <LayoutMobile />
      <LayoutLarge />
    </div>
  );
};

export default Header;