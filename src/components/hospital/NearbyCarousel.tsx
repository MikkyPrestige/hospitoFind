import { useEffect, useState } from "react";
import { api } from "@/services/api";
import HospitalCard from "@/components/hospital/HospitalCard";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import style from "./styles/nearbyCarousel.module.css";

interface Props {
    lat: number;
    lon: number;
    city?: string;
}

const NearbyCarousel = ({ lat, lon, city }: Props) => {
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNearby = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({ lat: String(lat), lon: String(lon), limit: "5" });
                const response = await api.get(`/hospitals/nearby?${params.toString()}`, { skipErrorToast: true } as any);
                const data = response.data;
                const results = Array.isArray(data) ? data : data.results || [];
                setHospitals(results);
            } catch (err: any) {
                setError("Unable to load nearby hospitals.");
            } finally {
                setLoading(false);
            }
        };
        fetchNearby();
    }, [lat, lon]);

    if (loading) {
        return <AnimatedLoader message="Finding nearby facilities..." variant="card" count={3} />;
    }

    if (error || hospitals.length === 0) {
        return null; // no carousel shown if no hospitals
    }

    return (
        <section className={style.section}>
            <h2 className={style.heading}>
                More options near {city || "this location"}
            </h2>
            <div className={style.carousel}>
                {hospitals.map((h) => (
                    <div key={h._id || h.hospitalId} className={style.cardWrapper}>
                        <HospitalCard hospital={h} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NearbyCarousel;