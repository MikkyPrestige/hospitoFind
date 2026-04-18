import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { MdFindInPage } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import { BsBuildingAdd } from "react-icons/bs";
import { FiList, FiSettings, FiCalendar, FiActivity, FiClock, FiHeart, FiX } from "react-icons/fi";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import { AiOutlineUserDelete, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import Logo from "@/assets/images/logo.svg";
import { useAuthContext } from "@/context/UserProvider";
import SearchForm from "@/components/search/Search";
import Editor from "@/markDown/editor";
import UpdateUser from "@/components/user/UpdateUser";
import UpdatePassword from "@/components/user/UpdatePassword";
import DeleteBtn from "@/components/user/DeleteUser";
import Logout from "@/components/user/LogoutUser";
import AccountStats from "./accountStats";
import MySubmissions from "./Submissions";
import ProfileDisplay from "../../components/user/profileDisplay";
import HealthTimeline from './HealthTimeline';
import { useUserActivity } from "@/hooks/useUserActivity";
import style from "./styles/scss/dashboard/dashboard.module.scss";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import { Avatar } from "@/components/ui/Avatar";
import Motion from "@/components/ui/Motion";
import { fadeUp, sectionReveal, settingsTabVariants } from "@/utils/animations";
import { AnimatePresence } from "framer-motion";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [selected, setSelected] = useState<string>("find-hospital");
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const [settingsTab, setSettingsTab] = useState<"profile" | "security" | "danger">("profile");
  const [isEditing, setIsEditing] = useState(false);
  const { state } = useAuthContext();
  const axiosPrivate = useAxiosPrivate();
  const { fetchActivity } = useUserActivity();
  const userPrefix = state?.username || "guest";
  const FAVORITES_KEY = `${userPrefix}_favorites`;
  const RECENTLY_KEY = `${userPrefix}_recentlyViewed`;
  const WEEKLY_KEY = `${userPrefix}_weeklyStats`;
  const [favorites, setFavorites] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [weeklyViews, setWeeklyViews] = useState<number>(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [savedHospitalContext, setSavedHospitalContext] = useState<{
    name: string; city?: string; country?: string;
  } | null>(null);

  useEffect(() => {
    const routerState = location.state as {
      tab?: string;
      hospitalContext?: { name: string; city?: string; country?: string };
    } | null;

    if (routerState?.tab) {
      setSelected(routerState.tab);
      localStorage.setItem('selectedLink', routerState.tab);
    }

    if (routerState?.hospitalContext) {
      setSavedHospitalContext(routerState.hospitalContext);
    }

    if (routerState?.hospitalContext || routerState?.tab) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, []);

  useEffect(() => {
    const hydrateData = async () => {
      if (!state?.accessToken) return;
      const localFavs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      const localRecents = JSON.parse(localStorage.getItem(RECENTLY_KEY) || "[]");
      setFavorites(localFavs);
      setRecentlyViewed(localRecents);

      const dbData = await fetchActivity();

      if (dbData) {
        setFavorites(dbData.favorites);
        setRecentlyViewed(dbData.recentlyViewed);
        setWeeklyViews(dbData.weeklyViews);

        localStorage.setItem(FAVORITES_KEY, JSON.stringify(dbData.favorites));
        localStorage.setItem(RECENTLY_KEY, JSON.stringify(dbData.recentlyViewed));
        localStorage.setItem(WEEKLY_KEY, JSON.stringify({
          count: dbData.weeklyViews,
          lastReset: Date.now()
        }));
      }
    };

    hydrateData();
  }, [state.accessToken, FAVORITES_KEY]);

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
    { id: "find-hospital", label: "Find Hospital", icon: <MdFindInPage /> },
    { id: "health-history", label: "Health Timeline", icon: <FiActivity /> },
    { id: "add-hospital", label: "Add Hospital", icon: <BsBuildingAdd /> },
    { id: "my-submissions", label: "My Submissions", icon: <FiList /> },
    { id: "settings", label: "Settings", icon: <FiSettings /> },
    { id: "logout", label: "Log Out", icon: <IoIosLogOut className={style.logoutItem} /> },
  ], []);

  useEffect(() => {
    const storedSelectedLink = localStorage.getItem("selectedLink");
    if (storedSelectedLink) setSelected(storedSelectedLink);
  }, []);

  const handleSelected = (link: string) => {
    setSelected(link);
    localStorage.setItem("selectedLink", link);
  };

  const removeFavorite = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();

    const next = favorites.filter((item: any) => item._id !== id);
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));

    try {
      await axiosPrivate.delete(`/user/favorites/${id}`);
      toast.success("Removed from saved collections");
    } catch (err) {
      console.error("Failed to delete favorite", err);
      toast.error("Could not sync with server");
    }
  };

  const removeRecent = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();

    const next = recentlyViewed.filter((item: any) => item._id !== id);
    setRecentlyViewed(next);
    localStorage.setItem(RECENTLY_KEY, JSON.stringify(next));
    try {
      await axiosPrivate.delete(`/user/history/${id}`);
      toast.success("Removed from recent history");
    } catch (err) {
      console.error("Failed to delete history item", err);
      toast.error("Could not sync with server");
    }
  };

  const getProviderName = () => {
    if (!state.auth0Id) return 'Social Provider';
    const id = state.auth0Id.toLowerCase();
    if (id.includes('google')) return 'Google';
    if (id.includes('facebook')) return 'Facebook';
    if (id.includes('twitter')) return 'Twitter';
    if (id.includes('linkedIn')) return 'LinkedIn';
    if (id.includes('auth0')) return 'Auth0';

    return 'Social Provider';
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
                <span className={style.icon}>{item.icon}</span>
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
                <div className={style.greetingText}>
                  <h1>Welcome back, <span className={style.userName}>{state?.username || 'User'}</span></h1>
                  <p className={style.activityStats}>
                    You have viewed <strong>{recentlyViewed.length}</strong> facilities recently
                    (<strong>{weeklyViews}</strong> visits this week).
                  </p>
                </div>

                <Motion variants={fadeUp} className={style.statsWrapper}>
                  <AccountStats />
                </Motion>
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
                  <div className={style.accordionSection}>
                    <div
                      className={`${style.sectionHeader} ${openFavorites ? style.headerOpen : ""}`}
                      onClick={() => setOpenFavorites(!openFavorites)}
                    >
                      <h2><FiHeart className={style.headerIcon} /> Saved Collections</h2>
                      <div className={style.chevron}>{openFavorites ? <AiOutlineUp /> : <AiOutlineDown />}</div>
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
                                      <span className={style.cardLocation}>{h.address.city}, {h.address.country}</span>
                                      <span className={style.ctaText}>View details &rarr;</span>
                                    </div>
                                  </Link>
                                  <button className={style.removeBtn} onClick={(e) => removeFavorite(e, h._id)} aria-label="Remove favorite"><FiX /></button>
                                </div>
                              ))}
                            </div>
                          ) : <p className={style.emptyMsg}>You haven't saved any facility yet.</p>}
                        </Motion>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className={style.accordionSection}>
                    <div
                      className={`${style.sectionHeader} ${openRecents ? style.headerOpen : ""}`}
                      onClick={() => setOpenRecents(!openRecents)}
                    >
                      <h2><FiClock className={style.headerIcon} /> Recent History</h2>
                      <div className={style.chevron}>{openRecents ? <AiOutlineUp /> : <AiOutlineDown />}</div>
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
                                      <span className={style.cardLocation}>{r.address.city}, {r.address.country}</span>
                                      <span className={style.ctaText}>View details &rarr;</span>
                                    </div>
                                  </Link>
                                  <button className={style.removeBtn} onClick={(e) => removeRecent(e, r._id)} aria-label="Remove recent"><FiX /></button>
                                </div>
                              ))}
                            </div>
                          ) : <p className={style.emptyMsg}>No recent browsing history available.</p>}
                        </Motion>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          )}

          {selected === "health-history" && (
            <Motion variants={fadeUp} className={style.viewPanel}>
              <HealthTimeline hospitalContext={savedHospitalContext} />
            </Motion>
          )}

          {selected === "add-hospital" && (
            <Motion variants={fadeUp} className={style.viewPanel}>
              <Editor />
              </Motion>
          )}

          {selected === "my-submissions" && (
            <Motion variants={fadeUp} className={style.viewPanel}>
              <MySubmissions />
            </Motion>
          )}

          {selected === "settings" && (
            <Motion variants={fadeUp} className={style.viewPanel}>
              <div className={style.settingsHub}>
                <header className={style.hubHeader}>
                  <div className={style.titleBox}>
                    <h1>Account & Security</h1>
                    <p>Manage your profile details and security preferences.</p>
                  </div>
                  <div className={style.metaStats}>
                    <div className={style.metaItem}>
                      <FiCalendar /> <span>Joined: {state?.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className={style.metaItem}>
                      <FiActivity /> <span>Last Updated: {state?.updatedAt ? new Date(state.updatedAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </header>

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
                    <AiOutlineUserDelete /> <span>Delete</span>
                  </button>
                </nav>

                <div className={style.tabContent}>
                  <AnimatePresence mode="wait">
                    {settingsTab === "profile" && (
                      <Motion
                        key="profile"
                        variants={settingsTabVariants}
                        initial="hidden" animate="visible" exit="exit" alwaysVisible={true}
                      >
                        <div className={style.settingsCard}>
                          <div className={style.cardHeader}>
                            <h3>{isEditing ? "Edit Profile" : "Profile Details"}</h3>
                          </div>
                          <div className={style.cardBody}>
                            {isEditing ? (
                              <>
                                <UpdateUser onSuccess={() => setIsEditing(false)} />
                                <button className={style.cancelBtn} onClick={() => setIsEditing(false)}>Close</button>
                              </>
                            ) : (
                              <ProfileDisplay onEditClick={() => setIsEditing(true)} />
                            )}
                          </div>
                        </div>
                      </Motion>
                    )}

                    {settingsTab === "security" && (
                      <Motion
                        key="security"
                        variants={settingsTabVariants}
                        initial="hidden" animate="visible" exit="exit" alwaysVisible={true}
                      >
                        <div className={style.settingsCard}>
                          <div className={style.cardHeader}><h3>Security Settings</h3></div>
                          {state.auth0Id ? (
                            <div className={style.socialLoginNotice}>
                              <div className={style.noticeHeader}>
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>Federated Account
                              </div>
                              <p className={style.noticeBody}>
                                You are signed in via <span className={style.providerTag}>{getProviderName()}</span>.
                              </p>
                              <p className={style.noticeFooter}>
                                To update your password or email, please visit your {getProviderName()} account settings.
                              </p>
                            </div>
                          ) : (
                            <div className={style.cardBody}>
                              <UpdatePassword />
                            </div>
                          )}
                        </div>
                      </Motion>
                    )}

                    {settingsTab === "danger" && (
                      <Motion
                        key="danger"
                        variants={settingsTabVariants}
                        initial="hidden" animate="visible" exit="exit" alwaysVisible={true}
                      >
                        <div className={`${style.settingsCard} ${style.dangerZone}`}>
                          <div className={style.cardHeader}><h3>Account Deletion</h3></div>
                          <div className={style.cardBody}>
                            <p className={style.warningMsg}>
                              Warning: This action is permanent. All your submitted data and saved lists will be erased.
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

          {selected === "logout" && <Motion variants={fadeUp} className={style.viewPanel}><Logout /></Motion>}
        </section>
      </section>
    </main>
  );
};

export default Dashboard;