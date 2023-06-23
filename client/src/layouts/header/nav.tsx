import { Link, NavLink, NavLinkProps } from "react-router-dom";
import { MdClose } from "react-icons/md"
import { FiMenu } from "react-icons/fi"
import { VscAccount } from "react-icons/vsc"
import { TbHomeHeart } from "react-icons/tb";
import { useState } from "react";
import Logo from "../../../public/images/logo.png";
import Search from "../../../public/images/hospitalSearch.png";
import { Avatar } from "@/components/avatar";
import layoutSmall from "./style/nav.module.css";
interface NavLinksProps extends NavLinkProps {
  to: string;
}

const Header = () => {
  return (
    <div>
      <LayoutMobile />
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
    <header className={layoutSmall.header}>
      <Link to="/" className={layoutSmall.logo}>
        <Avatar
          image={Logo}
          alt="logo"
          style={{ width: "100%", height: "100%", borderRadius: "45%" }}
        />
      </Link>
      <div className={layoutSmall.menu}>
        <button onClick={toggleMenu} className={layoutSmall.toggle}>
          {showMenu ? <MdClose className={layoutSmall.icon} /> : <FiMenu className={layoutSmall.icon} />}
        </button>
        <nav className={`${layoutSmall.nav} ${showMenu ? layoutSmall.show : ""}`}>
          <ul className={layoutSmall.list}>
            <li className={layoutSmall.item}>
              <TbHomeHeart className={layoutSmall.icon} />
              <NavLinks
                to="/"
                onClick={toggleMenu}
                className={layoutSmall.link}
              >
                Home
              </NavLinks>
            </li>
            <li className={layoutSmall.item}>
              <Avatar
                image={Logo}
                alt="logo"
                style={{ width: "2.2rem", height: "2.2rem", borderRadius: "10%", objectFit: "cover" }}
              />
              <NavLinks
                to="/about"
                onClick={toggleMenu}
                className={layoutSmall.link}
              >
                About
              </NavLinks>
            </li>
            <li className={layoutSmall.item}>
              <Avatar
                image={Search}
                alt="logo"
                style={{ width: "3rem", height: "3rem", borderRadius: "50%", objectFit: "cover" }}
              />
              <NavLinks
                to="/find"
                onClick={toggleMenu}
                className={layoutSmall.find}
              >
                Find Hospital
              </NavLinks>
            </li>
            <li className={layoutSmall.item}>
              <VscAccount className={layoutSmall.icon} />
              <NavLink
                to="/dashboard"
                className={layoutSmall.link}
                onClick={toggleMenu}
              >
                Profile
              </NavLink>
            </li>
          </ul>
          <div className={layoutSmall.container}>
            <NavLinks
              to="/login"
              onClick={toggleMenu}
              className={layoutSmall.content}
            >
              Login
            </NavLinks>
            <NavLinks
              to="/signUp"
              onClick={toggleMenu}
              className={layoutSmall.content}
            >
              SignUp
            </NavLinks>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header