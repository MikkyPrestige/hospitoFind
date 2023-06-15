import { NavLink, NavLinkProps } from "react-router-dom";
import { MdClose } from "react-icons/md"
import { FiMenu } from "react-icons/fi"
import { useState } from "react";
import Logo from "@/assets/images/logo.png";
import { Avatar } from "@/components/avatar";

interface NavLinksProps extends NavLinkProps {
  to: string;
}

export const Header = () => {
  return (
    <div className="header">
      <LayoutMobile />
    </div>
  )
}

const NavLinks = ({ to, ...props }: NavLinksProps) => {
  let active = {
    color: "red",
    fontWeight: "bold"
  }

  let pending = {
    color: "black",
    fontWeight: "normal"
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
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const toggleMenu = () => setShowMenu(!showMenu)

  return (
    <div className="layout-mobile">
      <div className="layout-mobile__header">
        <div className="layout-mobile__header__logo">
          <Avatar
            image={Logo}
            alt="logo"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="layout-mobile__header__menu">
          <button onClick={toggleMenu} className="layout-mobile__header__menu__btn">
            {showMenu ? <MdClose /> : <FiMenu />}
          </button>
          <nav
            className={`layout-mobile__header__menu__nav ${showMenu ? "layout-mobile__header__menu__nav--show" : ""
              }`}
          >
            <ul className="layout-mobile__header__menu__lists">
              <li>
                <NavLinks
                  to="/"
                  onClick={toggleMenu}
                  className="layout-mobile__header__menu__list--item"
                >
                  Home
                </NavLinks>
              </li>
              <li>
                <NavLinks
                  to="/about"
                  onClick={toggleMenu}
                  className="layout-mobile__header__menu__list--item"
                >
                  About
                </NavLinks>
              </li>
              <li>
                <NavLinks
                  to="/find"
                  onClick={toggleMenu}
                  className="layout-mobile__header__menu__list--item"
                >
                  Find Hospital
                </NavLinks>
              </li>
              <li>
                <NavLinks
                  to="/login"
                  onClick={toggleMenu}
                  className="layout-mobile__header__menu__list--item"
                >
                  Login
                </NavLinks>
              </li>
              <li>
                <NavLinks
                  to="/signUp"
                  onClick={toggleMenu}
                  className="layout-mobile__header__menu__list--item"
                >
                  SignUp
                </NavLinks>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}