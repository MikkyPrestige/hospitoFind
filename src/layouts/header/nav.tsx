import { Link, NavLink, NavLinkProps, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import Logo from "@/assets/images/logo.svg";
import { Avatar } from "@/components/avatar";
import style from "./style/nav.module.css";
import { useAuthContext } from "@/context/userContext";

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
          {/* <li>
            <NavLinks to="/" onClick={toggleMenu} className={style.smallLink}>
              Home
            </NavLinks>
          </li> */}
          <li>
            <NavLinks to="/find" onClick={toggleMenu} className={style.smallLink}>
              Find a Hospital
            </NavLinks>
          </li>
          <li>
            <NavLinks to="/about" onClick={toggleMenu} className={style.smallLink}>
              About Us
            </NavLinks>
          </li>
        </ul>

        <div className={style.smallWrapper}>
          {state.username ? (
            <NavLink to="/dashboard" className={style.dashboard} onClick={toggleMenu}>
              Dashboard
            </NavLink>
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
          {/* <li>
            <NavLinks to="/" className={style.largeLink}>
              Home
            </NavLinks>
          </li> */}
          <li>
            <NavLinks to="/find" className={style.largeLink}>
              Find a Hospital
            </NavLinks>
          </li>
          <li>
            <NavLinks to="/about" className={style.largeLink}>
              About Us
            </NavLinks>
          </li>
        </ul>

        <div className={style.largeWrapper}>
          {state.username ? (
            <NavLink to="/dashboard" className={style.dashboard}>
              Dashboard
            </NavLink>
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
      setScrolled(y > 50);
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