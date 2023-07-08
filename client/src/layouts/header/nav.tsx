import { Link, NavLink, NavLinkProps } from "react-router-dom";
import { MdClose } from "react-icons/md"
import { FiMenu } from "react-icons/fi"
import { VscAccount } from "react-icons/vsc"
import { TbHomeHeart } from "react-icons/tb";
import { useState } from "react";
import Logo from "@/assets/images/logo.jpg";
import { FcAbout } from "react-icons/fc";
import { FaSearchPlus } from "react-icons/fa";
import { Avatar } from "@/components/avatar";
import style from "./style/nav.module.css";
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

const LayoutMobile = () => {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

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
          <div className={style.smallWrapper}>
            <NavLinks
              to="/login"
              onClick={toggleMenu}
              className={style.smallAuth}
            >
              Login
            </NavLinks>
            <NavLinks
              to="/signUp"
              onClick={toggleMenu}
              className={style.smallAuth}
            >
              SignUp
            </NavLinks>
          </div>
        </nav>
      </div>
    </header>
  )
}

const LayoutLarge = () => {
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
          <NavLinks
            to="/login"
            className={style.largeAuth}
          >
            Login
          </NavLinks>
          <NavLinks
            to="/signUp"
            className={style.largeAuth}
          >
            SignUp
          </NavLinks>
        </div>
      </nav>
    </header>
  )
}

export default Header