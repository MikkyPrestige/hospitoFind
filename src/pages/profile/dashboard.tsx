import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { MdFindInPage, MdPublishedWithChanges } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { TbHomeHeart } from "react-icons/tb";
import { BsBuildingAdd } from "react-icons/bs";
import { LuPanelLeftClose } from "react-icons/lu";
import { AiOutlineUserDelete } from "react-icons/ai";
import Logo from "@/assets/images/logo.svg";
import { useAuthContext } from "@/context/userContext";
import SearchForm from "@/hospitalsConfig/search";
import Editor from "@/markDown/editor";
import UpdateUser from "@/userConfig/updateUser";
import DeleteBtn from "@/userConfig/deleteUser";
import Logout from "@/userConfig/logoutUser";
import style from "./style/dashboard.module.css";

const Dashboard = () => {
  const [selected, setSelected] = useState<string>("profile");
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const { state } = useAuthContext();

  const handleSelected = (link: string) => {
    setSelected(link);
    localStorage.setItem("selectedLink", link)
  }

  useEffect(() => {
    const storedSelectedLink = localStorage.getItem("selectedLink");
    if (storedSelectedLink) {
      setSelected(storedSelectedLink);
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
      <Helmet>
        <title>Dashboard | Find Hospitals</title>
        <meta name="description" content="Admin dashboard" />
      </Helmet>
      <div className={style.top}>
        <Link to="/" className={style.logo}>
          <img
            src={Logo}
            alt="logo"
            className={style.img}
          />
        </Link>
        <div>
          <div data-tooltip-id="sidebar" data-tooltip-content="Sidebar" data-tooltip-offset={3} >
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
            <li onClick={() => handleSelected("update-user")} className={`${style.list} ${selected === "update-user" ? style.active : ""}`}>
              <MdPublishedWithChanges className={style.icon} /> Update Profile
            </li>
            <li onClick={() => handleSelected("delete")} className={`${style.list} ${selected === "delete" ? style.active : ""}`}>
              <AiOutlineUserDelete className={style.icon} /> Delete Profile
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
              <h2 className={style.title}>Name</h2>
              <p className={style.state}>{state?.name}</p>
            </div>
            <div className={style.user}>
              <h2 className={style.title}>Username</h2>
              <p className={style.state}>{state?.username}</p>
            </div>
            <div className={style.user}>
              <h2 className={style.title}>Email Address</h2>
              <p className={style.state}>{state?.email}</p>
            </div>
            <Logout />
          </div>}
          {selected === "find-hospital" && <div className={style.details}>
            <h2 className={style.heading}>Find Hospital</h2>
            <SearchForm />
          </div>}
          {selected === "add-hospital" && <div className={style.details}>
            <h2 className={style.heading}>Add Hospital</h2>
            <Editor />
          </div>}
          {selected === "update-user" && <div className={style.details}>
            <h2 className={style.heading}>Update Profile</h2>
            <UpdateUser />
          </div>}
          {selected === "delete" && <div className={style.details}>
            <h2 className={style.heading}>Delete Profile</h2>
            <DeleteBtn />
          </div>}
        </section>
      </section>
    </main >
  );
}

export default Dashboard;