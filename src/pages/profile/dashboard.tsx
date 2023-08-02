// Admin dashboard
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdFindInPage } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { TbHomeHeart } from "react-icons/tb";
import { BsBuildingAdd } from "react-icons/bs";
import { LuPanelLeftClose } from "react-icons/lu";
import { Avatar } from "@/components/avatar";
import Logo from "@/assets/images/logo.svg";
import SearchForm from "@/hospitalsConfig/search";
import Editor from "@/markDown/editor";
import style from "./style/dashboard.module.css";
import { Tooltip } from "react-tooltip";
import { useAuth0 } from "@auth0/auth0-react";
import { IoMdLogOut } from "react-icons/io";
import { Button } from "@/components/button";
import { Helmet } from "react-helmet-async";

export const Auth0Logout = () => {
  const { logout, isLoading } = useAuth0();

  return (
    <>
      <Helmet>
        <title>Profile | Hospital Finder</title>
        <meta name="description" content="Logged in User Dashboard" />
        <meta name="keywords" content="hospital, doctor, appointment, health, care, medical, clinic, find, search, nearby, nearest" />
      </Helmet>
      <div className={style.logout}>
        <Button
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          disabled={isLoading}
          children={isLoading ? "Bye..." : <span className={style.span}><IoMdLogOut className={style.icon} /> Logout</span>}
          className={style.btn}
        />
      </div>
    </>
  );
}

const Dashboard = () => {
  const { user } = useAuth0();
  const [auth0User, setAuth0user] = useState<{
    name: string;
    nickname: string;
    picture: string;
    email: string;
  } | null>(null);
  const [selected, setSelected] = useState<string>("profile");
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

  const handleSelected = (link: string) => {
    setSelected(link);
    localStorage.setItem("selectedLink", link)
  }

  useEffect(() => {
    const storedSelectedLink = localStorage.getItem("selectedLink");
    if (storedSelectedLink) {
      setSelected(storedSelectedLink);
    }

    if (user) {
      setAuth0user({
        name: user.name || "",
        nickname: user.nickname || "",
        picture: user.picture || "",
        email: user.email || ""
      })
    }

    return () => {
      localStorage.removeItem("selectedLink");
    }

  }, [])

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <main className={style.dashboard}>
      <div className={style.top}>
        <Link to="/" className={style.logo}>
          <img
            src={Logo}
            alt="logo"
            className={style.img}
          />
        </Link>
        <div>
          <div data-tooltip-id="sidebar" data-tooltip-content="Hide sidebar" data-tooltip-offset={3} >
            <LuPanelLeftClose onClick={toggleSidebar} className={style.close} />
          </div>
          <Tooltip id="sidebar" style={{
            fontSize: "1.5rem",
            padding: "1rem"
          }} />
        </div>
      </div>
      <section className={style.section}>
        <nav className={`${!sidebarVisible ? style.sidebarHidden : style.nav}`}>
          <ul className={style.lists}>
            <li onClick={() => handleSelected("profile")} className={`${style.list} ${selected === "profile" ? style.active : ""}`}>
              <CgProfile className={style.icon} /> Profile
            </li>
            <li onClick={() => handleSelected("find-hospital")} className={`${style.list} ${selected === "find-hospital" ? style.active : ""}`}>
              <MdFindInPage className={style.icon} /> Find Hospital
            </li>
            <li onClick={() => handleSelected("add-hospital")} className={`${style.list} ${selected === "add-hospital" ? style.active : ""}`}>
              <BsBuildingAdd className={style.icon} /> Add Hospital
            </li>
            <li className={`${style.list} ${style.home}`}>
              <Link to="/" className={style.list} >
                <TbHomeHeart className={style.icon} /> Home
              </Link>
            </li>
          </ul>
        </nav>

        <section className={style.profile}>
          {selected === "profile" && <div className={style.details}>
            <h2 className={style.heading}>PROFILE DETAILS</h2>
            <div className={style.user}>
              <div className={style.photo}>
                <Avatar image={user?.picture} alt="User Photo" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              </div>
              <h2 className={style.title}>Name</h2>
              <p className={style.state}>{auth0User?.name}</p>
              <h2 className={style.title}>Nickname</h2>
              <p className={style.state}>{auth0User?.nickname}</p>
              <h2 className={style.title}>Email</h2>
              <p className={style.state}>{auth0User?.email}</p>
            </div>
            <Auth0Logout />
          </div>}
          {selected === "find-hospital" && <div className={style.details}>
            <h2 className={style.heading}>Find Hospital</h2>
            <SearchForm />
          </div>}
          {selected === "add-hospital" && <div className={style.details}>
            <h2 className={style.heading}>Add Hospital</h2>
            <Editor />
          </div>}
        </section>
      </section>
    </main >
  );
}

export default Dashboard;