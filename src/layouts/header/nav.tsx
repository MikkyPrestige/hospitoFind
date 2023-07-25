import { Link, NavLink, NavLinkProps, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md"
import { FiMenu } from "react-icons/fi"
import { VscAccount } from "react-icons/vsc"
import { TbHomeHeart } from "react-icons/tb";
import { useState } from "react";
import Logo from "@/assets/images/logo.svg";
import { FcAbout } from "react-icons/fc";
import { FaSearchPlus } from "react-icons/fa";
import { Avatar } from "@/components/avatar";
import style from "./style/nav.module.css";
import { useAuth0 } from "@auth0/auth0-react";
import { IoMdLogOut } from "react-icons/io";
interface NavLinksProps extends NavLinkProps {
  to: string;
}

const Header = () => {
  return (
    <div>
      <LayoutMobile />
      <LayoutLarge />
    </div>
  )
}

export const NavLinks = ({ to, ...props }: NavLinksProps) => {
  let active = {
    color: "#08299B",
  }

  let pending = {
    color: "#000000",
  }

  return (
    <NavLink
      to={to}
      style={({ isActive, isPending }) =>
        (isPending ? pending : isActive ? active : pending)
      }
      {...props}
    />
  )
}

const Auth0Logout = () => {
  const { logout, isLoading } = useAuth0();

  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className={style.logout}
    >
      {isLoading ? "Bye..." : <span className={style.smallSpan}><IoMdLogOut className={style.smallIcon} /> Logout</span>}
    </button>
  );
}

const LayoutMobile = () => {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();


  const handleLoginClick = async () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      await loginWithRedirect({
        appState: {
          returnTo: "/dashboard",
        },
      });
    }
    setShowMenu(!showMenu)
  }

  const handleSignUpClick = async () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      await loginWithRedirect({
        appState: {
          returnTo: "/dashboard",
        },
        authorizationParams: {
          screen_hint: "signup",
        },
      });
    }
    setShowMenu(!showMenu)
  }


  return (
    <header className={style.smallHeader}>
      <Link to="/" className={style.smallLogo}>
        <Avatar
          image={Logo}
          alt="logo"
          style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "color-burn" }}
        />
      </Link>
      <div className={style.menu}>
        <button onClick={toggleMenu} className={style.toggle}>
          {showMenu ? <MdClose className={style.toggle_icon} /> : <FiMenu className={style.toggle_icon} />}
        </button>
        <nav className={`${style.smallNav} ${showMenu ? style.show : ""}`}>
          <ul className={style.smallList}>
            <li className={style.smallItem}>
              <TbHomeHeart className={style.smallIcon} />
              <NavLinks
                to="/"
                onClick={toggleMenu}
                className={style.smallLink}
              >
                Home
              </NavLinks>
            </li>
            <li className={style.smallItem}>
              <FcAbout className={style.smallIcon} />
              <NavLinks
                to="/about"
                onClick={toggleMenu}
                className={style.smallLink}
              >
                About
              </NavLinks>
            </li>
            <li className={style.smallItem}>
              <FaSearchPlus className={style.smallIcon} />
              <NavLinks
                to="/find"
                onClick={toggleMenu}
                className={style.smallFind}
              >
                Find Hospital
              </NavLinks>
            </li>
            <li className={style.smallItem}>
              <VscAccount className={style.smallIcon} />
              <NavLink
                to="/dashboard"
                className={style.smallLink}
                onClick={toggleMenu}
              >
                Profile
              </NavLink>
            </li>
          </ul>
          {isAuthenticated ? (
            <div className={style.smallWrapper}>
              <Auth0Logout />
            </div>
          ) : (
            <div className={style.smallWrapper}>
              <button
                onClick={handleLoginClick}
                className={style.smallAuth}
              >
                Login
              </button>
              <button
                onClick={handleSignUpClick}
                className={style.smallAuth}
              >
                Signup
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

const LayoutLarge = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();


  const handleLoginClick = async () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      await loginWithRedirect({
        appState: {
          returnTo: "/dashboard",
        },
      });
    }
  }

  const handleSignUpClick = async () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      await loginWithRedirect({
        appState: {
          returnTo: "/dashboard",
        },
        authorizationParams: {
          screen_hint: "signup",
        },
      });
    }
  }

  return (
    <header className={style.large}>
      <Link to="/" className={style.largeLogo}>
        <Avatar
          image={Logo}
          alt="logo"
          style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "color-burn" }}
        />
      </Link>
      <nav className={style.largeNav}>
        <ul className={style.largeList}>
          <li className={style.largeItem}>
            <TbHomeHeart className={style.largeIcon} />
            <NavLinks
              to="/"
              className={style.largeLink}
            >
              Home
            </NavLinks>
          </li>
          <li className={style.largeItem}>
            <FcAbout className={style.largeIcon} />
            <NavLinks
              to="/about"
              className={style.largeLink}
            >
              About
            </NavLinks>
          </li>
          <li className={style.largeItem}>
            <FaSearchPlus className={style.largeIcon} />
            <NavLinks
              to="/find"
              className={style.largeFind}
            >
              Find Hospital
            </NavLinks>
          </li>
          <li className={style.largeItem}>
            <VscAccount className={style.largeIcon} />
            <NavLink
              to="/dashboard"
              className={style.largeLink}
            >
              Profile
            </NavLink>
          </li>
        </ul>
        <div className={style.largeWrapper}>
          {isAuthenticated ? (
            <Auth0Logout />
          ) : (
            <div className={style.largeWrapper}>
              <button
                onClick={handleLoginClick}
                className={style.largeAuth}
              >
                Login
              </button>
              <button
                onClick={handleSignUpClick}
                className={style.largeAuth}
              >
                Signup
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header