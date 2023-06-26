// Admin dashboard
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/userContext";
import { Button } from "@/components/button";
import { MdFindInPage, MdOutlineAddLocationAlt, MdPublishedWithChanges } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { AiOutlineExport, AiOutlineUserDelete } from "react-icons/ai";
import { TbHomeHeart } from "react-icons/tb";
import { BsBuildingAdd, BsShareFill } from "react-icons/bs";
import { Avatar } from "@/components/avatar";
import UserPhoto from "@/assets/images/user.jpg";
import SearchForm from "@/components/hospitalsConfig/search";
import UpdateForm from "@/forms/upDateForm";
import Export from "@/components/hospitalsConfig/export";
import Share from "@/components/hospitalsConfig/share";
import Editor from "@/markDown/editor";
import DeleteBtn from "@/forms/deleteBtn";
import Logout from "@/forms/logOutBtn";
import style from "./style/dashboard.module.css"

const Dashboard = () => {
  const { state } = useAuthContext();
  const [selected, setSelected] = useState<string>("profile ");

  const handleSelected = (link: string) => {
    setSelected(link);
    localStorage.setItem("selectedLink", link)
  }

  useEffect(() => {
    const storedSelectedLink = localStorage.getItem("selectedLink");
    if (storedSelectedLink) {
      setSelected(storedSelectedLink);
    }
  }, [])

  // STYLE
  const home = `${style.list} ${style.home}`;
  const del = `${style.list} ${style.del}`;

  return (
    <main className={style.dashboard}>
      <nav className={style.nav}>
        <Link to="/" className={style.logo}>CareFinder</Link>
        <ul className={style.lists}>
          <li onClick={() => handleSelected("profile")} className={`${style.list} ${selected === "profile" ? style.active : ""}`}>
            <CgProfile className={style.icon} /> Profile
          </li>
          <li onClick={() => handleSelected("find-hospital")} className={`${style.list} ${selected === "find-hospital" ? style.active : ""}`}>
            <MdFindInPage className={style.icon} /> Find Hospital
          </li>
          <li onClick={() => handleSelected("share-hospital")} className={`${style.list} ${selected === "share-hospital" ? style.active : ""}`}>
            <BsShareFill className={style.icon} /> Share Hospital
          </li>
          <li onClick={() => handleSelected("export-hospital")} className={`${style.list} ${selected === "export-hospital" ? style.active : ""}`}>
            <AiOutlineExport className={style.icon} /> Export Location
          </li>
          <li onClick={() => handleSelected("add-hospital")} className={`${style.list} ${selected === "add-hospital" ? style.active : ""}`}>
            <BsBuildingAdd className={style.icon} /> Add Hospital
          </li>
          <li onClick={() => handleSelected("add-location")} className={`${style.list} ${selected === "add-location" ? style.active : ""}`}>
            <MdOutlineAddLocationAlt className={style.icon} /> Add Address
          </li>
          <li onClick={() => handleSelected("update")} className={`${style.list} ${selected === "update" ? style.active : ""}`}>
            <MdPublishedWithChanges className={style.icon} /> Update Profile
          </li>
          <li className={home}>
            <Link to="/" className={style.list} >
              <TbHomeHeart className={style.icon} /> Home
            </Link>
          </li>
          <li onClick={() => handleSelected("delete")} className={`${del} ${selected === "delete" ? style.active : ""}`}>
            <AiOutlineUserDelete className={style.icon} /> Delete Account
          </li>
        </ul>
      </nav>
      <section className={style.profile}>
        <div className={style.photo}>
          <Avatar image={UserPhoto} alt="User Photo" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
        </div>
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
        {selected === "share-hospital" && <div>
          <h2>Share Hospital</h2>
          <Share
            searchParams={
              {
                city: "New York",
                state: "New York"
              }
            }
          />
        </div>}
        {selected === "export-hospital" && <div>
          <h2>Export Location</h2>
          <Export searchParams={
            {
              city: "New York",
              state: "New York"
            }
          } />
        </div>}
        {selected === "add-hospital" && <div>
          <h2>Add Hospital</h2>
          <Editor />
        </div>}
        {selected === "add-location" && <div>
          <h2>Add your address so we can customize your search and serve you with the hospitals nearby</h2>
          <Button children={<>Add</>} />
        </div>}
        {selected === "update" && <div>
          <h2>Update your profile</h2>
          <UpdateForm />
        </div>}
        {selected === "delete" && <div>
          <h2>Delete Account</h2>
          <DeleteBtn />
        </div>}
      </section>
    </main>
  );
}

export default Dashboard;