import { NavLink, useParams } from "react-router-dom";
import { useSharedHospitals } from "@/hooks/useSharedHospitals";
import { Avatar } from "@/components/ui/Avatar";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import style from "./styles/popular.module.css";
import { SEOHelmet } from "../ui/SeoHelmet";

const ShareHospitalList = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const { hospitalList, loading, error } = useSharedHospitals(linkId);

  return (
    <>
      <SEOHelmet
        title={
          hospitalList.length > 0
            ? `${hospitalList[0].name} & ${hospitalList.length - 1} more hospitals shared`
            : "Shared Hospital List"
        }
        description={
          hospitalList.length > 0
            ? `View the shared list of ${hospitalList.length} verified hospitals and healthcare facilities.`
            : "Shared hospital list from HospitoFind."
        }
        canonical={`https://hospitofind.online/share/${linkId}`}
        schemaType="sharedList"
        schemaData={hospitalList}
        autoBreadcrumbs={true}
        lang="en"
        robots="noindex, nofollow"
      />

      <div className={style.sharePage}>
        {error && <div className={style.error}>{error}</div>}
        {loading ? (
          <AnimatedLoader message="Retrieving shared facility list..." variant="card" count={3} />
        ) : (
          <div className={`${style.shareContent} ${style.wrapper}`}>
            {hospitalList.map((hospital, id) => (
              <li key={id} className={style.card}>
                <div className={style.shareImg}>
                  {hospital?.photoUrl ?
                    <Avatar
                      image={hospital.photoUrl}
                      alt={`Photo of ${hospital.name} in ${hospital.address.city}`}
                      className={style.shareAvatar}
                    /> :
                    <Avatar
                      image={HospitalPic}
                      alt="Photo of an hospital"
                      className={style.shareAvatar}
                    />}
                </div>
                <div className={style.details}>
                  <h3 className={style.name}>{hospital.name}</h3>
                  <h3 className={style.address}>{hospital?.address.street}</h3>
                  <NavLink
                    to={`/hospital/${hospital.address.state}/${hospital.address.city}/${hospital.slug}`}
                    className={style.btn}
                  >
                    View Hospital
                  </NavLink>
                </div>
              </li>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ShareHospitalList;
