import { useState, useEffect, useMemo } from "react";
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
import style from "./style/dashboard.module.scss";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import { Avatar } from "@/components/avatar";
import Motion from "@/components/motion";
import { fadeUp, sectionReveal, zoomIn } from "@/hooks/animations";
import { AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [selected, setSelected] = useState<string>("find-hospital");
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const { state } = useAuthContext();

  // --- DYNAMIC USER-SPECIFIC KEYS ---
  const userPrefix = state?.username || "guest";
  const FAVORITES_KEY = `${userPrefix}_favorites`;
  const RECENTLY_KEY = `${userPrefix}_recentlyViewed`;
  const WEEKLY_KEY = `${userPrefix}_weeklyStats`;

  const [favorites, setFavorites] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [weeklyViews, setWeeklyViews] = useState<number>(0);

  // Sync state with LocalStorage whenever user switches
  useEffect(() => {
    if (state?.username) {
      setFavorites(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
      setRecentlyViewed(JSON.parse(localStorage.getItem(RECENTLY_KEY) || "[]"));
      const savedWeekly = JSON.parse(localStorage.getItem(WEEKLY_KEY) || "{}");
      setWeeklyViews(savedWeekly.count || 0);
    }
  }, [state?.username, FAVORITES_KEY, RECENTLY_KEY, WEEKLY_KEY]);

  // CALLBACKS FOR REAL-TIME UPDATES
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
    { id: "profile", label: "Account", icon: <CgProfile />, color: "#08299B" },
    { id: "security", label: "Security", icon: <RiLockPasswordLine />, color: "#08299B" },
    { id: "logout", label: "Log Out", icon: <IoIosLogOut />, color: "#FF033E" },
    { id: "delete", label: "Delete Account", icon: <AiOutlineUserDelete />, color: "#FF033E" },
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
          {selected === "find-hospital" && (
            <div className={style.viewContainer}>
              <div className={style.bg}></div>

              <header className={style.greetingHeader}>
                <h1>Good to see you, <span className={style.userName}>{state?.username || 'User'}</span>.</h1>
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

          {selected === "add-hospital" && <Motion variants={fadeUp} className={style.viewPanel}><Editor /></Motion>}

          {selected === "profile" && (
            <Motion variants={fadeUp} className={style.viewPanel}>
              <div className={style.settingsCard}>
                <h3>Account Information</h3>
                <div className={style.dataGrid}>
                  <div className={style.dataRow}><span className={style.label}>Full Name</span><span>{state?.name}</span></div>
                  <div className={style.dataRow}><span className={style.label}>Username</span><span>{state?.username}</span></div>
                  <div className={style.dataRow}><span className={style.label}>Email Address</span><span>{state?.email}</span></div>
                </div>
                <button onClick={() => setShowEdit(true)} className={style.actionBtn}>Update Profile Info</button>
                <AnimatePresence>
                  {showEdit && (
                    <div className={style.modalOverlay} onClick={() => setShowEdit(false)}>
                      <Motion variants={zoomIn} className={style.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={style.modalHeader}><h4>Edit Profile</h4><button onClick={() => setShowEdit(false)}>✕</button></div>
                        <div className={style.modalBody}><UpdateUser /></div>
                      </Motion>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </Motion>
          )}

          {selected === "security" && <Motion variants={fadeUp} className={style.viewPanel}><UpdatePassword /></Motion>}
          {selected === "logout" && <Motion variants={fadeUp} className={style.viewPanel}><Logout /></Motion>}
          {selected === "delete" && <Motion variants={fadeUp} className={style.viewPanel}><DeleteBtn /></Motion>}
        </section>
      </section>
    </main>
  );
};

export default Dashboard;

// import { useState, useEffect, useMemo } from "react";
// import { Helmet } from "react-helmet-async";
// import { Link } from "react-router-dom";
// import { Tooltip } from "react-tooltip";
// import { MdFindInPage } from "react-icons/md";
// import { CgProfile } from "react-icons/cg";
// import { RiLockPasswordLine } from "react-icons/ri";
// import { IoIosLogOut } from "react-icons/io";
// import { BsBuildingAdd } from "react-icons/bs";
// import {
//   TbLayoutSidebarLeftCollapse,
//   TbLayoutSidebarRightCollapse,
// } from "react-icons/tb";
// import { AiOutlineUserDelete, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
// import Logo from "@/assets/images/logo.svg";
// import { useAuthContext } from "@/context/userContext";
// import SearchForm from "@/hospitalsConfig/search";
// import Editor from "@/markDown/editor";
// import UpdateUser from "@/userConfig/updateUser";
// import UpdatePassword from "@/userConfig/updatePassword";
// import DeleteBtn from "@/userConfig/deleteUser";
// import Logout from "@/userConfig/logoutUser";
// import style from "./style/dashboard.module.scss";
// import HospitalPic from "@/assets/images/hospital-logo.jpg";
// import { Avatar } from "@/components/avatar";
// import Motion from "@/components/motion";
// import { fadeUp, sectionReveal, zoomIn } from "@/hooks/animations";
// import { AnimatePresence } from "framer-motion";

// const RECENTLY_KEY = "recentlyViewedHospitals";
// const FAVORITES_KEY = "favoriteHospitals";

// const Dashboard = () => {
//   const [selected, setSelected] = useState<string>("find-hospital");
//   const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
//   const [showEdit, setShowEdit] = useState<boolean>(false);
//   const { state } = useAuthContext();

//   const [favorites, setFavorites] = useState<any[]>(() =>
//     JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]")
//   );
//   const [recentlyViewed, setRecentlyViewed] = useState<any[]>(() =>
//     JSON.parse(localStorage.getItem(RECENTLY_KEY) || "[]")
//   );

//   const [weeklyViews, setWeeklyViews] = useState<number>(() => {
//     const stored = JSON.parse(localStorage.getItem("weeklyStats") || "{}");
//     return stored.count || 0;
//   });
//   // Defaulted to closed for a cleaner initial mobile load
//   const [openFavorites, setOpenFavorites] = useState<boolean>(false);
//   const [openRecents, setOpenRecents] = useState<boolean>(false);
//   const [hasResults, setHasResults] = useState<boolean>(false);

//   const menuItems = useMemo(() => [
//     { id: "find-hospital", label: "Find Hospital", icon: <MdFindInPage />, color: "#08299B" },
//     { id: "add-hospital", label: "Add Hospital", icon: <BsBuildingAdd />, color: "#08299B" },
//     { id: "profile", label: "Account", icon: <CgProfile />, color: "#08299B" },
//     { id: "security", label: "Security", icon: <RiLockPasswordLine />, color: "#08299B" },
//     { id: "logout", label: "Log Out", icon: <IoIosLogOut />, color: "#FF033E" },
//     { id: "delete", label: "Delete Account", icon: <AiOutlineUserDelete />, color: "#FF033E" },
//   ], []);

//   useEffect(() => {
//     const storedSelectedLink = localStorage.getItem("selectedLink");
//     if (storedSelectedLink) setSelected(storedSelectedLink);
//   }, []);

//   const handleSelected = (link: string) => {
//     setSelected(link);
//     localStorage.setItem("selectedLink", link);
//   };

//   const handleFavoritesUpdate = () => {
//     const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
//     setFavorites(saved);
//   };

//   const removeFavorite = (e: React.MouseEvent, name: string) => {
//     e.preventDefault(); e.stopPropagation();
//     const next = favorites.filter((item: any) => item.name !== name);
//     setFavorites(next);
//     localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
//   };

//   const removeRecent = (e: React.MouseEvent, name: string) => {
//     e.preventDefault(); e.stopPropagation();
//     const next = recentlyViewed.filter((item: any) => item.name !== name);
//     setRecentlyViewed(next);
//     localStorage.setItem(RECENTLY_KEY, JSON.stringify(next));
//   };

//   return (
//     <main className={style.dashboard}>
//       <Helmet><title>Dashboard | HospitoFind</title></Helmet>

//       {/* --- TOP HEADER --- */}
//       <header className={style.top}>
//         <Link to="/" className={style.logo}>
//           <img src={Logo} alt="Logo" className={style.img} />
//         </Link>
//         <div className={style.sidebarToggle}>
//           {sidebarExpanded ? (
//             <TbLayoutSidebarLeftCollapse onClick={() => setSidebarExpanded(false)} className={style.sidebarIcon} />
//           ) : (
//             <TbLayoutSidebarRightCollapse onClick={() => setSidebarExpanded(true)} className={style.sidebarIcon} />
//           )}
//         </div>
//       </header>

//       <section className={style.mainLayout}>
//         {/* --- RESPONSIVE SIDEBAR --- */}
//         <nav className={`${style.nav} ${!sidebarExpanded ? style.miniSidebar : ""}`}>
//           <ul className={style.menuList}>
//             {menuItems.map((item) => (
//               <li
//                 key={item.id}
//                 onClick={() => handleSelected(item.id)}
//                 className={`${style.menuItem} ${selected === item.id ? style.active : ""}`}
//                 data-tooltip-id="sidebar-tip"
//                 data-tooltip-content={!sidebarExpanded ? item.label : ""}
//               >
//                 <span className={style.icon} style={{ color: item.color }}>{item.icon}</span>
//                 {sidebarExpanded && <span className={style.label}>{item.label}</span>}
//               </li>
//             ))}
//           </ul>
//           <Tooltip id="sidebar-tip" place="right" />
//         </nav>

//         {/* --- CONTENT AREA --- */}
//         <section className={style.contentArea}>
//           {selected === "find-hospital" && (
//             <div className={style.viewContainer}>
//               <div className={style.bg}></div>

//               <header className={style.greetingHeader}>
//                 <h1>Good to see you, <span className={style.userName}>{state?.username || 'User'}</span>.</h1>
//                 <p className={style.activityStats}>
//                   You've viewed <strong>{recentlyViewed.length}</strong> hospitals recently
//                   (<strong>{weeklyViews}</strong> this week).
//                 </p>
//               </header>

//               <div className={style.searchSection}>
//                 <SearchForm
//                   onSearchResultsChange={setHasResults}
//                   onFavoritesUpdate={handleFavoritesUpdate}
//                   onWeeklyViewsChange={setWeeklyViews}
//                 />
//               </div>

//               {!hasResults && (
//                 <div className={style.overviewGrid}>
//                   {/* SAVED SECTION */}
//                   <div className={style.accordionSection}>
//                     <div
//                       className={`${style.sectionHeader} ${openFavorites ? style.headerOpen : ""}`}
//                       onClick={() => setOpenFavorites(!openFavorites)}
//                     >
//                       <h2>❤️ Saved Hospitals</h2>
//                       {openFavorites ? <AiOutlineUp /> : <AiOutlineDown />}
//                     </div>
//                     <AnimatePresence>
//                       {openFavorites && (
//                         <Motion
//                           key="favorites-list"
//                           className={style.accordionContent}
//                           variants={sectionReveal}
//                           initial="hidden" animate="visible" exit="hidden"
//                         >
//                           {favorites.length > 0 ? (
//                             <div className={style.listWrapper}>
//                               {favorites.map((h, i) => (
//                                 <div key={i} className={style.dashboardCard}>
//                                   <Link to={`/hospital/${encodeURIComponent(h.address.country)}/${encodeURIComponent(h.address.city)}/${h.slug}`} className={style.cardLink}>
//                                     <Avatar image={h.photoUrl || HospitalPic} alt={h.name} className={style.cardAvatar} />
//                                     <div className={style.cardInfo}>
//                                       <span className={style.cardName}>{h.name}</span>
//                                       <span className={style.cardLocation}>{h.address.city}</span>
//                                       <span className={style.ctaText}>View details →</span>
//                                     </div>
//                                   </Link>
//                                   <button className={style.removeBtn} onClick={(e) => removeFavorite(e, h.name)}>✕</button>
//                                 </div>
//                               ))}
//                             </div>
//                           ) : <p className={style.emptyMsg}>No saved hospitals yet.</p>}
//                         </Motion>
//                       )}
//                     </AnimatePresence>
//                   </div>

//                   {/* RECENT SECTION */}
//                   <div className={style.accordionSection}>
//                     <div
//                       className={`${style.sectionHeader} ${openRecents ? style.headerOpen : ""}`}
//                       onClick={() => setOpenRecents(!openRecents)}
//                     >
//                       <h2>🕒 Recently Viewed</h2>
//                       {openRecents ? <AiOutlineUp /> : <AiOutlineDown />}
//                     </div>
//                     <AnimatePresence>
//                       {openRecents && (
//                         <Motion
//                           key="recents-list"
//                           className={style.accordionContent}
//                           variants={sectionReveal}
//                           initial="hidden" animate="visible" exit="hidden"
//                         >
//                           {recentlyViewed.length > 0 ? (
//                             <div className={style.listWrapper}>
//                               {recentlyViewed.map((r, i) => (
//                                 <div key={i} className={style.dashboardCard}>
//                                   <Link to={`/hospital/${encodeURIComponent(r.address.country)}/${encodeURIComponent(r.address.city)}/${r.slug}`} className={style.cardLink}>
//                                     <Avatar image={r.photoUrl || HospitalPic} alt={r.name} className={style.cardAvatar} />
//                                     <div className={style.cardInfo}>
//                                       <span className={style.cardName}>{r.name}</span>
//                                       <span className={style.cardLocation}>{r.address.city}</span>
//                                       <span className={style.ctaText}>View details →</span>
//                                     </div>
//                                   </Link>
//                                   <button className={style.removeBtn} onClick={(e) => removeRecent(e, r.name)}>✕</button>
//                                 </div>
//                               ))}
//                             </div>
//                           ) : <p className={style.emptyMsg}>Start exploring our verified database.</p>}
//                         </Motion>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {selected === "add-hospital" && <Motion variants={fadeUp} className={style.viewPanel}><Editor /></Motion>}

//           {selected === "profile" && (
//             <Motion variants={fadeUp} className={style.viewPanel}>
//               <div className={style.settingsCard}>
//                 <h3>Account Information</h3>
//                 <div className={style.dataGrid}>
//                   <div className={style.dataRow}><span className={style.label}>Full Name</span><span>{state?.name}</span></div>
//                   <div className={style.dataRow}><span className={style.label}>Username</span><span>{state?.username}</span></div>
//                   <div className={style.dataRow}><span className={style.label}>Email Address</span><span>{state?.email}</span></div>
//                 </div>
//                 <button onClick={() => setShowEdit(true)} className={style.actionBtn}>Update Profile Info</button>
//                 <AnimatePresence>
//                   {showEdit && (
//                     <div className={style.modalOverlay} onClick={() => setShowEdit(false)}>
//                       <Motion variants={zoomIn} className={style.modalContent} onClick={(e) => e.stopPropagation()}>
//                         <div className={style.modalHeader}><h4>Edit Profile</h4><button onClick={() => setShowEdit(false)}>✕</button></div>
//                         <div className={style.modalBody}><UpdateUser /></div>
//                       </Motion>
//                     </div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </Motion>
//           )}

//           {selected === "security" && <Motion variants={fadeUp} className={style.viewPanel}><UpdatePassword /></Motion>}
//           {selected === "logout" && <Motion variants={fadeUp} className={style.viewPanel}><Logout /></Motion>}
//           {selected === "delete" && <Motion variants={fadeUp} className={style.viewPanel}><DeleteBtn /></Motion>}

//         </section>
//       </section>
//     </main>
//   );
// };

// export default Dashboard;
