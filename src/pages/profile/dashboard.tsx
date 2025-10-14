import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { MdFindInPage } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import { BsBuildingAdd } from "react-icons/bs";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { AiOutlineUserDelete } from "react-icons/ai";
import Logo from "@/assets/images/logo.svg";
import { useAuthContext } from "@/context/userContext";
import SearchForm from "@/hospitalsConfig/search";
import Editor from "@/markDown/editor";
import UpdateUser from "@/userConfig/updateUser";
import UpdatePassword from "@/userConfig/updatePassword";
import DeleteBtn from "@/userConfig/deleteUser";
import Logout from "@/userConfig/logoutUser";
import style from "./style/dashboard.module.css";
import bgStyle from "../../components/style/random.module.css";

const Dashboard = () => {
  const [selected, setSelected] = useState<string>("find-hospital");
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [showEdit, setShowEdit] = useState<boolean>(false);
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

  const handleShowEdit = () => {
    setShowEdit(!showEdit);
  }

  return (
    <main className={style.dashboard}>
      <Helmet>
        <title>Dashboard | Find Hospitals</title>
        <meta name="description" content="Admin dashboard" />
      </Helmet>
      <div className={style.top}>
        <div className={bgStyle.bg}></div>
        <Link to="/" className={style.logo}>
          <img
            src={Logo}
            alt="logo"
            className={style.img}
          />
        </Link>
        <div>
          <div data-tooltip-id="sidebar" data-tooltip-content="Sidebar" data-tooltip-offset={3} >
            {sidebarVisible ? <TbLayoutSidebarLeftCollapse onClick={toggleSidebar} className={style.sidebar} /> : <TbLayoutSidebarRightCollapse onClick={toggleSidebar} className={style.sidebar} />}
          </div>
          <Tooltip id="sidebar" style={{
            fontSize: "1.3rem",
            padding: ".3rem .8rem"
          }} />
        </div>
      </div>
      <section className={style.section}>
        <nav className={`${!sidebarVisible ? style.sidebarHidden : style.nav}`}>
          <ul className={style.lists}>
            <li onClick={() => handleSelected("find-hospital")} className={`${style.list} ${selected === "find-hospital" ? style.active : ""}`}>
              <MdFindInPage style={{ fontSize: "2rem", fill: "#08299B" }} /> Find Hospital
            </li>
            <li onClick={() => handleSelected("add-hospital")} className={`${style.list} ${selected === "add-hospital" ? style.active : ""}`}>
              <BsBuildingAdd style={{ fontSize: "2rem", fill: "#08299B" }} /> Add Hospital
            </li>
            <li onClick={() => handleSelected("profile")} className={`${style.list} ${selected === "profile" ? style.active : ""}`}>
              <CgProfile style={{ fontSize: "2rem", color: "#08299B" }} /> Account
            </li>
            <li onClick={() => handleSelected("security")} className={`${style.list} ${selected === "security" ? style.active : ""}`}>
              <RiLockPasswordLine style={{ fontSize: "2rem", color: "#08299B" }} /> Security
            </li>
            <li onClick={() => handleSelected("logout")} className={`${style.list} ${selected === "logout" ? style.active : ""}`}>
              <IoIosLogOut style={{ fontSize: "2rem", fill: "#FF033E" }} /> Log Out
            </li>
            <li onClick={() => handleSelected("delete")} className={`${style.list} ${selected === "delete" ? style.active : ""}`}>
              <AiOutlineUserDelete style={{ fontSize: "2rem", fill: "#FF033E" }} /> Delete Account
            </li>
          </ul>
        </nav>

        <section className={style.profile}>
          {selected === "find-hospital" && <div className={style.details}>
            <SearchForm />
          </div>}
          {selected === "add-hospital" && <div className={style.details}>
            <Editor />
          </div>}
          {selected === "profile" && <div className={style.details}>
            <div className={style.wrapper}>
              <h2 className={style.heading}>Personal info</h2>
              <div className={style.container}>
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
              </div>
              <div className={style.editWrap}>
                <button onClick={handleShowEdit} className={style.editBtn}>{showEdit ? "Cancel" : "Edit Profile"}</button>
                {showEdit && <UpdateUser />}
              </div>
            </div>
          </div>}
          {selected === "security" && <div className={style.details}>
            <UpdatePassword />
          </div>}
          {selected === "logout" && <div className={style.details}>
            <Logout />
          </div>}
          {selected === "delete" && <div className={style.details}>
            <DeleteBtn />
          </div>}
        </section>
      </section>
    </main >
  );
}

export default Dashboard;