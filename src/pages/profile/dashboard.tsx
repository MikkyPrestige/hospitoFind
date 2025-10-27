import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { MdFindInPage } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import { BsBuildingAdd } from "react-icons/bs";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import { AiOutlineUserDelete, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
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
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import { Avatar } from "@/components/avatar";
import Motion from "@/components/motion";
import { fadeUp, sectionReveal } from "@/hooks/animations";

const RECENTLY_KEY = "recentlyViewedHospitals";
const FAVORITES_KEY = "favoriteHospitals";

const Dashboard = () => {
  const [selected, setSelected] = useState<string>("find-hospital");
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const { state } = useAuthContext();

  // data
  const [favorites, setFavorites] = useState<any[]>(() =>
    JSON.parse(localStorage.getItem("favoriteHospitals") || "[]")
  );
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>(() =>
    JSON.parse(localStorage.getItem("recentlyViewedHospitals") || "[]")
  );

  // accordion state
  const [openFavorites, setOpenFavorites] = useState<boolean>(true);
  const [openRecents, setOpenRecents] = useState<boolean>(true);

  const [hasResults, setHasResults] = useState<boolean>(false);

  const handleFavoritesUpdate = () => {
    const saved = JSON.parse(localStorage.getItem('favoriteHospitals') || '[]');
    setFavorites(saved);
  };

  // toggle handlers
  const toggleFavoritesSection = () => setOpenFavorites((s) => !s);
  const toggleRecentsSection = () => setOpenRecents((s) => !s);

  const handleSelected = (link: string) => {
    setSelected(link);
    localStorage.setItem("selectedLink", link);
  };

  useEffect(() => {
    const storedSelectedLink = localStorage.getItem("selectedLink");
    if (storedSelectedLink) {
      setSelected(storedSelectedLink);
    }

    // load from localStorage
    try {
      const recents = JSON.parse(localStorage.getItem(RECENTLY_KEY) || "[]");
      setRecentlyViewed(recents);
    } catch {
      setRecentlyViewed([]);
    }

    try {
      const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      setFavorites(favs);
    } catch {
      setFavorites([]);
    }

    return () => {
      localStorage.removeItem("selectedLink");
    };
  }, []);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const handleShowEdit = () => setShowEdit(!showEdit);

  return (
    <main className={style.dashboard}>
      <Helmet>
        <title>Dashboard | Find Hospitals</title>
        <meta name="description" content="Admin dashboard" />
      </Helmet>

      {/* Top header — subtle entrance (once) */}
      <Motion variants={fadeUp} className={style.top} once={true}>
        <div className={bgStyle.bg}></div>
        <Link to="/" className={style.logo}>
          <img src={Logo} alt="logo" className={style.img} />
        </Link>
        <div>
          <div
            data-tooltip-id="sidebar"
            data-tooltip-content="Sidebar"
            data-tooltip-offset={3}
          >
            {sidebarVisible ? (
              <TbLayoutSidebarLeftCollapse
                onClick={toggleSidebar}
                className={style.sidebar}
              />
            ) : (
              <TbLayoutSidebarRightCollapse
                onClick={toggleSidebar}
                className={style.sidebar}
              />
            )}
          </div>
          <Tooltip
            id="sidebar"
            style={{
              fontSize: "1.3rem",
              padding: ".3rem .5rem",
            }}
          />
        </div>
      </Motion>

      <section className={style.section}>
        <Motion
          as="nav"
          variants={fadeUp}
          className={`${!sidebarVisible ? style.sidebarHidden : style.nav}`}
          once={true}
        >
          <ul className={style.lists}>
            <li
              onClick={() => handleSelected("find-hospital")}
              className={`${style.list} ${selected === "find-hospital" ? style.active : ""
                }`}
            >
              <MdFindInPage style={{ fontSize: "2rem", fill: "#08299B" }} /> Find
              Hospital
            </li>
            <li
              onClick={() => handleSelected("add-hospital")}
              className={`${style.list} ${selected === "add-hospital" ? style.active : ""
                }`}
            >
              <BsBuildingAdd style={{ fontSize: "2rem", fill: "#08299B" }} /> Add
              Hospital
            </li>
            <li
              onClick={() => handleSelected("profile")}
              className={`${style.list} ${selected === "profile" ? style.active : ""
                }`}
            >
              <CgProfile style={{ fontSize: "2rem", color: "#08299B" }} /> Account
            </li>
            <li
              onClick={() => handleSelected("security")}
              className={`${style.list} ${selected === "security" ? style.active : ""
                }`}
            >
              <RiLockPasswordLine
                style={{ fontSize: "2rem", color: "#08299B" }}
              />{" "}
              Security
            </li>
            <li
              onClick={() => handleSelected("logout")}
              className={`${style.list} ${selected === "logout" ? style.active : ""
                }`}
            >
              <IoIosLogOut style={{ fontSize: "2rem", fill: "#FF033E" }} /> Log
              Out
            </li>
            <li
              onClick={() => handleSelected("delete")}
              className={`${style.list} ${selected === "delete" ? style.active : ""
                }`}
            >
              <AiOutlineUserDelete
                style={{ fontSize: "2rem", fill: "#FF033E" }}
              />{" "}
              Delete Account
            </li>
          </ul>
        </Motion>

        <Motion as="section" variants={sectionReveal} className={style.profile}>
          {selected === "find-hospital" && (
            <div className={style.details}>
              <Motion variants={fadeUp} className={style.searchWrapper}>
                <SearchForm
                  onSearchResultsChange={setHasResults}
                  onFavoritesUpdate={handleFavoritesUpdate}
                />
              </Motion>

              {!hasResults && (
                <div className={style.favoritesWrapper}>
                  {/* --- SAVED HOSPITALS --- */}
                  <section className={style.favoritesSection}>
                    <div
                      className={style.sectionHeader}
                      onClick={() => toggleFavoritesSection()}
                    >
                      <h2 className={style.favoritesTitle}>❤️ Saved Hospitals</h2>
                      {openFavorites ? (
                        <AiOutlineUp className={style.toggleIcon} />
                      ) : (
                        <AiOutlineDown className={style.toggleIcon} />
                      )}
                    </div>

                    <Motion
                      variants={sectionReveal}
                      className={`${style.accordionContent} ${openFavorites ? style.open : ""
                        }`}
                      initial="hidden"
                      animate={openFavorites ? "visible" : "hidden"}
                      once={false}
                    >
                      {favorites.length > 0 ? (
                        <div className={style.favoritesList}>
                          {favorites.map((h: any, i: number) => (
                            <Motion
                              key={`${h.name}-${i}`}
                              variants={fadeUp}
                              className={style.favoriteCard}
                            >
                              <Link
                                to={`${h._id || h.name}`}
                                onClick={(e) => e.stopPropagation()}
                                className={style.favoriteCard}
                              >
                                <Avatar
                                  image={h.photoUrl || HospitalPic}
                                  alt={h.name}
                                  style={{
                                    width: "5rem",
                                    height: "5rem",
                                    borderRadius: "1rem",
                                    objectFit: "cover",
                                  }}
                                />
                                <div className={style.recentInfo}>
                                  <div className={style.favoriteName}>{h.name}</div>
                                  <div className={style.recentCity}>{h.address?.city || ""}</div>
                                </div>
                              </Link>
                              <button
                                className={style.removeBtn}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const next = favorites.filter((item: any) => item.name !== h.name);
                                  setFavorites(next);
                                  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
                                }}
                              >
                                ✕
                              </button>
                            </Motion>
                          ))}
                        </div>
                      ) : (
                        <p className={style.emptyText}>You have no saved hospital. Explore and save your favorite hospitals for quick access.</p>
                      )}
                    </Motion>
                  </section>

                  {/* --- RECENTLY VIEWED HOSPITALS --- */}
                  <section className={style.recentSection}>
                    <div
                      className={style.sectionHeader}
                      onClick={() => toggleRecentsSection()}
                    >
                      <h2 className={style.recentTitle}>🕒 Recently Viewed</h2>
                      {openRecents ? (
                        <AiOutlineUp className={style.toggleIcon} />
                      ) : (
                        <AiOutlineDown className={style.toggleIcon} />
                      )}
                    </div>

                    <Motion
                      variants={sectionReveal}
                      className={`${style.accordionContent} ${openRecents ? style.open : ""
                        }`}
                      initial="hidden"
                      animate={openRecents ? "visible" : "hidden"}
                      once={false}
                    >
                      {recentlyViewed.length > 0 ? (
                        <div className={style.recentList}>
                          {recentlyViewed.map((r, i) => (
                            <Motion key={`${r.name}-${i}`} variants={fadeUp} className={style.recentItem}>
                              <Link
                                to={`${r._id || r.name}`}
                                className={style.recentItem}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Avatar
                                  image={r.photoUrl || HospitalPic}
                                  alt={r.name}
                                  style={{
                                    width: "5rem",
                                    height: "5rem",
                                    borderRadius: "1rem",
                                    objectFit: "cover",
                                  }}
                                />
                                <div className={style.recentInfo}>
                                  <div className={style.recentName}>{r.name}</div>
                                  <div className={style.recentCity}>{r.address?.city || ""}</div>
                                </div>
                              </Link>
                              <button
                                className={style.removeBtn}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const next = recentlyViewed.filter((item: any) => item.name !== r.name);
                                  setRecentlyViewed(next);
                                  localStorage.setItem(RECENTLY_KEY, JSON.stringify(next));
                                }}
                              >
                                ✕
                              </button>
                            </Motion>
                          ))}
                        </div>
                      ) : (
                        <p className={style.emptyText}>You have not viewed any hospital. Start exploring to find hospitals near you.</p>
                      )}
                    </Motion>
                  </section>
                </div>
              )}
            </div>
          )}

          {selected === "add-hospital" && (
            <Motion variants={fadeUp} className={style.details}>
              <Editor />
            </Motion>
          )}

          {selected === "profile" && (
            <Motion variants={fadeUp} className={style.details}>
              <div className={style.profileCard}>
                <h2 className={style.heading}>My Info</h2>
                <div className={style.infoList}>
                  <div className={style.infoItem}>
                    <span className={style.label}>Name</span>
                    <span className={style.value}>{state?.name}</span>
                  </div>
                  <div className={style.infoItem}>
                    <span className={style.label}>Username</span>
                    <span className={style.value}>{state?.username}</span>
                  </div>
                  <div className={style.infoItem}>
                    <span className={style.label}>Email Address</span>
                    <span className={style.value}>{state?.email}</span>
                  </div>
                </div>

                <button onClick={handleShowEdit} className={style.editBtn}>
                  {showEdit ? "Cancel" : "Update info"}
                </button>

                {showEdit && (
                  <div
                    className={style.modalOverlay}
                    onClick={handleShowEdit}
                  >
                    <Motion variants={fadeUp} className={style.modal} onClick={(e) => e.stopPropagation()}>
                      <div className={style.modalHeader}>
                        <h3>Update info</h3>
                        <button
                          onClick={handleShowEdit}
                          className={style.closeBtn}
                        >
                          ✕
                        </button>
                      </div>
                      <div className={style.modalBody}>
                        <UpdateUser />
                      </div>
                    </Motion>
                  </div>
                )}
              </div>
            </Motion>
          )}

          {selected === "security" && (
            <Motion variants={fadeUp} className={style.details}>
              <UpdatePassword />
            </Motion>
          )}
          {selected === "logout" && (
            <Motion variants={fadeUp} className={style.details}>
              <Logout />
            </Motion>
          )}
          {selected === "delete" && (
            <Motion variants={fadeUp} className={style.details}>
              <DeleteBtn />
            </Motion>
          )}
        </Motion>
      </section>
    </main>
  );
};

export default Dashboard;