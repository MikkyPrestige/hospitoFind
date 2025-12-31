import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { MdFindInPage } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import { BsBuildingAdd } from "react-icons/bs";
import { FiList, FiSettings, FiCalendar, FiActivity } from "react-icons/fi";
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
import AccountStats from "./accountStats";
import MySubmissions from "./userSubmissions";
import style from "./style/dashboard.module.scss";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import { Avatar } from "@/components/avatar";
import Motion from "@/components/motion";
import { fadeUp, sectionReveal, settingsTabVariants } from "@/hooks/animations";
import { AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [selected, setSelected] = useState<string>("find-hospital");
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [settingsTab, setSettingsTab] = useState<"profile" | "security" | "danger">("profile");
  const { state } = useAuthContext();

  // --- DYNAMIC USER-SPECIFIC KEYS ---
  const userPrefix = state?.username || "guest";
  const FAVORITES_KEY = `${userPrefix}_favorites`;
  const RECENTLY_KEY = `${userPrefix}_recentlyViewed`;
  const WEEKLY_KEY = `${userPrefix}_weeklyStats`;

  const [favorites, setFavorites] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [weeklyViews, setWeeklyViews] = useState<number>(0);

  useEffect(() => {
    if (state?.username) {
      setFavorites(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
      setRecentlyViewed(JSON.parse(localStorage.getItem(RECENTLY_KEY) || "[]"));
      const savedWeekly = JSON.parse(localStorage.getItem(WEEKLY_KEY) || "{}");
      setWeeklyViews(savedWeekly.count || 0);
    }
  }, [state?.username, FAVORITES_KEY, RECENTLY_KEY, WEEKLY_KEY]);

  const handleRecentUpdate = () => {
    setRecentlyViewed(JSON.parse(localStorage.getItem(RECENTLY_KEY) || "[]"));
  };

  const handleFavoritesUpdate = () => {
    setFavorites(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
  };

  const [openFavorites, setOpenFavorites] = useState<boolean>(false);
  const [openRecents, setOpenRecents] = useState<boolean>(false);
  const [hasResults, setHasResults] = useState<boolean>(false);

  const menuItems = useMemo(() => [
    { id: "find-hospital", label: "Find Hospital", icon: <MdFindInPage />, color: "#08299B" },
    { id: "add-hospital", label: "Add Hospital", icon: <BsBuildingAdd />, color: "#08299B" },
    { id: "my-submissions", label: "My Submissions", icon: <FiList />, color: "#08299B" },
    { id: "settings", label: "Settings", icon: <FiSettings />, color: "#08299B" },
    { id: "logout", label: "Log Out", icon: <IoIosLogOut />, color: "#FF033E" },
  ], []);

  useEffect(() => {
    const storedSelectedLink = localStorage.getItem("selectedLink");
    if (storedSelectedLink) setSelected(storedSelectedLink);
  }, []);

  const handleSelected = (link: string) => {
    setSelected(link);
    localStorage.setItem("selectedLink", link);
  };

  const removeFavorite = (e: React.MouseEvent, name: string) => {
    e.preventDefault(); e.stopPropagation();
    const next = favorites.filter((item: any) => item.name !== name);
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  const removeRecent = (e: React.MouseEvent, name: string) => {
    e.preventDefault(); e.stopPropagation();
    const next = recentlyViewed.filter((item: any) => item.name !== name);
    setRecentlyViewed(next);
    localStorage.setItem(RECENTLY_KEY, JSON.stringify(next));
  };

  return (
    <main className={style.dashboard}>
      <Helmet><title>Dashboard | HospitoFind</title></Helmet>

      <header className={style.top}>
        <Link to="/" className={style.logo}>
          <img src={Logo} alt="Logo" className={style.img} />
        </Link>
        <div className={style.sidebarToggle}>
          {sidebarExpanded ? (
            <TbLayoutSidebarLeftCollapse onClick={() => setSidebarExpanded(false)} className={style.sidebarIcon} />
          ) : (
            <TbLayoutSidebarRightCollapse onClick={() => setSidebarExpanded(true)} className={style.sidebarIcon} />
          )}
        </div>
      </header>

      <section className={style.mainLayout}>
        <nav className={`${style.nav} ${!sidebarExpanded ? style.miniSidebar : ""}`}>
          <ul className={style.menuList}>
            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelected(item.id)}
                className={`${style.menuItem} ${selected === item.id ? style.active : ""}`}
                data-tooltip-id="sidebar-tip"
                data-tooltip-content={!sidebarExpanded ? item.label : ""}
              >
                <span className={style.icon} style={{ color: item.color }}>{item.icon}</span>
                {sidebarExpanded && <span className={style.label}>{item.label}</span>}
              </li>
            ))}
          </ul>
          <Tooltip id="sidebar-tip" place="right" />
        </nav>

        <section className={style.contentArea}>
          {/* VIEW: FIND HOSPITAL */}
          {selected === "find-hospital" && (
            <div className={style.viewContainer}>
              <div className={style.bg}></div>

              <header className={style.greetingHeader}>
                <h1>Good to see you, <span className={style.userName}>{state?.username || 'User'}</span>.</h1>

                {/* Impact Stats Card */}
                <Motion variants={fadeUp}>
                  <AccountStats />
                </Motion>

                <p className={style.activityStats}>
                  You've viewed <strong>{recentlyViewed.length}</strong> hospitals recently
                  (<strong>{weeklyViews}</strong> this week).
                </p>
              </header>

              <div className={style.searchSection}>
                <SearchForm
                  onSearchResultsChange={setHasResults}
                  onFavoritesUpdate={handleFavoritesUpdate}
                  onRecentUpdate={handleRecentUpdate}
                  onWeeklyViewsChange={setWeeklyViews}
                />
              </div>

              {!hasResults && (
                <div className={style.overviewGrid}>
                  {/* SAVED SECTION */}
                  <div className={style.accordionSection}>
                    <div
                      className={`${style.sectionHeader} ${openFavorites ? style.headerOpen : ""}`}
                      onClick={() => setOpenFavorites(!openFavorites)}
                    >
                      <h2>❤️ Saved Hospitals</h2>
                      {openFavorites ? <AiOutlineUp /> : <AiOutlineDown />}
                    </div>
                    <AnimatePresence>
                      {openFavorites && (
                        <Motion
                          key="favorites-list-motion"
                          className={style.accordionContent}
                          variants={sectionReveal}
                          initial="hidden" animate="visible" exit="hidden"
                        >
                          {favorites.length > 0 ? (
                            <div className={style.listWrapper}>
                              {favorites.map((h, i) => (
                                <div key={i} className={style.dashboardCard}>
                                  <Link to={`/hospital/${encodeURIComponent(h.address.country)}/${encodeURIComponent(h.address.city)}/${h.slug}`} className={style.cardLink}>
                                    <Avatar image={h.photoUrl || HospitalPic} alt={h.name} className={style.cardAvatar} />
                                    <div className={style.cardInfo}>
                                      <span className={style.cardName}>{h.name}</span>
                                      <span className={style.cardLocation}>{h.address.city}</span>
                                      <span className={style.ctaText}>View details →</span>
                                    </div>
                                  </Link>
                                  <button className={style.removeBtn} onClick={(e) => removeFavorite(e, h.name)}>✕</button>
                                </div>
                              ))}
                            </div>
                          ) : <p className={style.emptyMsg}>No saved hospitals yet.</p>}
                        </Motion>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* RECENT SECTION */}
                  <div className={style.accordionSection}>
                    <div
                      className={`${style.sectionHeader} ${openRecents ? style.headerOpen : ""}`}
                      onClick={() => setOpenRecents(!openRecents)}
                    >
                      <h2>🕒 Recently Viewed</h2>
                      {openRecents ? <AiOutlineUp /> : <AiOutlineDown />}
                    </div>
                    <AnimatePresence>
                      {openRecents && (
                        <Motion
                          key="recents-list-motion"
                          className={style.accordionContent}
                          variants={sectionReveal}
                          initial="hidden" animate="visible" exit="hidden"
                        >
                          {recentlyViewed.length > 0 ? (
                            <div className={style.listWrapper}>
                              {recentlyViewed.map((r, i) => (
                                <div key={i} className={style.dashboardCard}>
                                  <Link to={`/hospital/${encodeURIComponent(r.address.country)}/${encodeURIComponent(r.address.city)}/${r.slug}`} className={style.cardLink}>
                                    <Avatar image={r.photoUrl || HospitalPic} alt={r.name} className={style.cardAvatar} />
                                    <div className={style.cardInfo}>
                                      <span className={style.cardName}>{r.name}</span>
                                      <span className={style.cardLocation}>{r.address.city}</span>
                                      <span className={style.ctaText}>View details →</span>
                                    </div>
                                  </Link>
                                  <button className={style.removeBtn} onClick={(e) => removeRecent(e, r.name)}>✕</button>
                                </div>
                              ))}
                            </div>
                          ) : <p className={style.emptyMsg}>Start exploring our verified database.</p>}
                        </Motion>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: ADD HOSPITAL */}
          {selected === "add-hospital" && <Motion variants={fadeUp} className={style.viewPanel}><Editor /></Motion>}

          {/* VIEW: MY SUBMISSIONS */}
          {selected === "my-submissions" && (
            <Motion variants={fadeUp} className={style.viewPanel}>
              <MySubmissions />
            </Motion>
          )}

          {/* VIEW: CONSOLIDATED SETTINGS HUB */}
          {selected === "settings" && (
            <Motion variants={fadeUp} className={style.viewPanel}>
              <div className={style.settingsHub}>
                <header className={style.hubHeader}>
                  <div className={style.titleBox}>
                    <h1>Account Settings</h1>
                    <p>Update your personal details and security preferences.</p>
                  </div>
                  <div className={style.metaStats}>
                    <div className={style.metaItem}>
                      <FiCalendar /> <span>Member since: {state?.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className={style.metaItem}>
                      <FiActivity /> <span>Last update: {state?.updatedAt ? new Date(state.updatedAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </header>

                {/* Segmented Tab Control */}
                <nav className={style.tabsNav}>
                  <button
                    className={settingsTab === "profile" ? style.activeTab : ""}
                    onClick={() => setSettingsTab("profile")}
                  >
                    <CgProfile /> <span>Profile</span>
                  </button>
                  <button
                    className={settingsTab === "security" ? style.activeTab : ""}
                    onClick={() => setSettingsTab("security")}
                  >
                    <RiLockPasswordLine /> <span>Security</span>
                  </button>
                  <button
                    className={`${settingsTab === "danger" ? style.activeTab : ""} ${style.dangerTab}`}
                    onClick={() => setSettingsTab("danger")}
                  >
                    <AiOutlineUserDelete /> <span>Account</span>
                  </button>
                </nav>

                {/* Tab Content with AnimatePresence for smooth sliding */}
                <div className={style.tabContent}>
                  <AnimatePresence mode="wait">
                    {settingsTab === "profile" && (
                      <Motion
                        key="profile"
                        variants={settingsTabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        alwaysVisible={true}
                      >
                        <div className={style.settingsCard}>
                          <div className={style.cardHeader}><h3>Personal Information</h3></div>
                          <div className={style.cardBody}><UpdateUser /></div>
                        </div>
                      </Motion>
                    )}

                    {settingsTab === "security" && (
                      <Motion
                        key="security"
                        variants={settingsTabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        alwaysVisible={true}
                      >
                        <div className={style.settingsCard}>
                          <div className={style.cardHeader}><h3>Security Settings</h3></div>
                          <div className={style.cardBody}><UpdatePassword /></div>
                        </div>
                      </Motion>
                    )}

                    {settingsTab === "danger" && (
                      <Motion
                        key="danger"
                        variants={settingsTabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        alwaysVisible={true}
                      >
                        <div className={`${style.settingsCard} ${style.dangerZone}`}>
                          <div className={style.cardHeader}><h3>Account Management</h3></div>
                          <div className={style.cardBody}>
                            <p className={style.warningText}>
                              Warning: Deleting your account is a permanent action. All your verified submissions
                              and saved hospitals will be removed from the platform.
                            </p>
                            <DeleteBtn />
                          </div>
                        </div>
                      </Motion>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Motion>
          )}

          {/* LOGOUT VIEW */}
          {selected === "logout" && <Motion variants={fadeUp} className={style.viewPanel}><Logout /></Motion>}
        </section>
      </section>
    </main>
  );
};

export default Dashboard;