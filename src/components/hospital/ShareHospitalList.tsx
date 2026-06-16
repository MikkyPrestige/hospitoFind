import { useParams } from "react-router-dom";
import { useSharedHospitals } from "@/hooks/useSharedHospitals";
import HospitalCard from "@/components/hospital/HospitalCard";
import { useGeolocation } from "@/hooks/useGeolocation";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import style from "./styles/shareHospitalList.module.css";
import { SEOHelmet } from "../ui/SeoHelmet";

const ShareHospitalList = () => {
  const userCoords = useGeolocation();
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
            {hospitalList.map((hospital) => (
              <HospitalCard key={hospital._id} hospital={hospital} userCoords={userCoords} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ShareHospitalList;
