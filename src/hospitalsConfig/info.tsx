// import { useEffect, useState } from "react";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import { getHospitalByName } from "@/services/api";
// import { Hospital } from "@/services/hospital";
// import { Avatar } from "@/components/avatar";
// import HospitalPic from "@/assets/images/hospital-logo.jpg";
// import style from "./style/info/info.module.css";
// import { FaPhone, FaGlobe, FaEnvelope } from "react-icons/fa";
// import Footer from "@/layouts/footer/footer";
// import Motion from "@/components/motion";
// import { fadeUp, sectionReveal } from "@/hooks/animations";
// import { SEOHelmet } from "@/components/utils/seoUtils";

// const HospitalInfo = () => {
//   const { name } = useParams();
//   const [hospital, setHospital] = useState<Hospital | null>(null);
//   const [error, setError] = useState<string>("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchHospitalDetails = async () => {
//       if (!name) return;
//       try {
//         const response = await getHospitalByName(name);
//         setHospital(response);
//       } catch (err: any) {
//         if (err.data) setError(err.message);
//         else if (err.request) setError("Server did not respond");
//         else setError(err.message);
//       }
//     };
//     fetchHospitalDetails();
//   }, [name]);

//   if (!hospital) return null;

//   const mapQuery = `${hospital.address?.street || ""}, ${hospital.address?.city || ""}, ${hospital.address?.state || ""}`;
//   const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

//   return (
//     <>
//       <SEOHelmet
//         title={hospital.name}
//         description={`Learn more about ${hospital.name}, located in ${hospital.address?.city}, ${hospital.address?.state}. Services: ${hospital.services?.join(", ") || "General healthcare"}.`}
//         canonical={`https://hospitofind.online/hospital/${encodeURIComponent(
//           hospital.name.toLowerCase().replace(/\s+/g, "-")
//         )}`}
//         image={hospital.photoUrl || HospitalPic}
//         schemaType="hospital"
//         schemaData={hospital}
//         autoBreadcrumbs={true}
//         includeBrand={true}
//       />

//       <div className={style.hospital}>
//         <Motion variants={fadeUp} as="nav" className={style.breadcrumb}>
//           <Link to="/">Home</Link> / <Link to="/find-hospital">Hospitals</Link> /{" "}
//           <span>{hospital.name}</span>
//         </Motion>

//         <Motion variants={fadeUp} as="h1" className={style.heading}>
//           Welcome to {hospital.name}
//         </Motion>

//         <Motion variants={sectionReveal} as="div" className={style.wrapper}>
//           <Motion variants={fadeUp} className={style.img}>
//             <Avatar
//               image={hospital.photoUrl || HospitalPic}
//               alt={`Photo of ${hospital.name} in ${hospital.address.city}`}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 borderRadius: "1.2rem",
//                 objectFit: "cover",
//               }}
//             />
//           </Motion>

//           <Motion variants={fadeUp} className={style.details}>
//             <div className={style.section}>
//               <h3 className={style.section_title}>📍 Address</h3>
//               <p>
//                 {hospital.address.street}, {hospital.address.city},{" "}
//                 {hospital.address.state}
//               </p>
//             </div>

//             <div className={style.section}>
//               <h3 className={style.section_title}>📞 Contact</h3>

//               {hospital.phoneNumber && (
//                 <div className={style.section_head}>
//                   <p className={style.section_headTitle}>
//                     <FaPhone /> Call Us:
//                   </p>
//                   <a
//                     href={`tel:${hospital.phoneNumber}`}
//                     className={style.contact}
//                   >
//                     {hospital.phoneNumber}
//                   </a>
//                 </div>
//               )}

//               {hospital.website && (
//                 <div className={style.section_head}>
//                   <p className={style.section_headTitle}>
//                     <FaGlobe /> Visit Website:
//                   </p>
//                   <a
//                     href={hospital.website}
//                     target="_blank"
//                     rel="noreferrer"
//                     className={style.contact}
//                   >
//                     {hospital.website}
//                   </a>
//                 </div>
//               )}

//               {hospital.email && (
//                 <div className={style.section_head}>
//                   <p className={style.section_headTitle}>
//                     <FaEnvelope /> Email:
//                   </p>
//                   <a
//                     href={`mailto:${hospital.email}?subject=Hello ${hospital.name}!`}
//                     target="_blank"
//                     rel="noreferrer"
//                     className={style.contact}
//                   >
//                     {hospital.email}
//                   </a>
//                 </div>
//               )}
//             </div>

//             {/* Map */}
//             {hospital.address && (
//               <div className={style.section}>
//                 <h3 className={style.section_title}>🗺️ Location Map</h3>
//                 <iframe
//                   title={`Map of ${hospital.name}`}
//                   src={mapUrl}
//                   className={style.map}
//                   allowFullScreen
//                   loading="lazy"
//                   referrerPolicy="no-referrer-when-downgrade"
//                 ></iframe>
//               </div>
//             )}

//             {hospital.type && (
//               <div className={style.section}>
//                 <h3 className={style.section_title}>🏢 Hospital Type</h3>
//                 <p className={style.type}>{hospital.type}</p>
//               </div>
//             )}

//             {hospital.services && (
//               <div className={style.section}>
//                 <h3 className={style.section_title}>💉 Specializations</h3>
//                 <ul className={style.list}>
//                   {hospital.services.map((s, i) => (
//                     <li key={i}>{s}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {hospital.hours && (
//               <div className={style.section}>
//                 <h3 className={style.section_title}>🕓 Opening Hours</h3>
//                 <ul className={style.hours}>
//                   {hospital.hours.map((hour, i) => (
//                     <li key={i}>
//                       <span>{hour.day}</span> <span>{hour.open}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {hospital.comments && (
//               <div className={style.section}>
//                 <h3 className={style.section_title}>
//                   💬 Additional Information
//                 </h3>
//                 <ul className={style.list}>
//                   {hospital.comments.map((comment, i) => (
//                     <li key={i}>{comment}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {error && <p className={style.error}>{error}</p>}
//           </Motion>
//         </Motion>

//         <Motion variants={fadeUp} className={style.backWrapper}>
//           <button onClick={() => navigate(-1)} className={style.backBtn}>
//             ← Go Back
//           </button>
//         </Motion>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default HospitalInfo;