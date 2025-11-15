import React from "react";
import { Hospital } from "../services/hospital";
import style from "./style/hospitalCard.module.css";


interface HospitalCardProps {
  hospital: Hospital;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
  const { name, type, address, phoneNumber, email, website, photoUrl } = hospital;

  const hasImage = Boolean(photoUrl);

  return (
    <div className={style.card}>
      <div className={`${style.imageWrapper} ${!hasImage ? style.noImage : ""}`}>
        {hasImage ? (
          <img
            src={photoUrl}
            alt={name}
            loading="lazy"
            className={style.image}
          />
        ) : (
          <div className={style.placeholder}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={style.placeholderIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5m-16.5 0a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5m-16.5 0v10.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V6.75m-3 7.5-2.25-3-1.875 2.25L9 9l-3.75 5.25"
              />
            </svg>
            <p>No image</p>
          </div>
        )}
      </div>

      <div className={style.content}>
        <h3 className={style.name}>{name}</h3>
        {type && <p className={style.type}>{type}</p>}
        <p className={style.info}>
          {address?.city && <span>{address.city}, </span>}
          {address?.country}
        </p>
        {phoneNumber && <p className={style.phone}>📞 {phoneNumber}</p>}
        {email && <p className={style.email}>✉️ {email}</p>}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className={style.link}
          >
            Visit Website →
          </a>
        )}
      </div>
    </div>
  );
};

export default HospitalCard;

// import React from "react";
// import style from "./style/hospitalCard.module.css";

// const HospitalCard = ({ hospital }) => {
//   const { name, type, address, phoneNumber, email, website, photoUrl } = hospital;

//   const hasImage = Boolean(photoUrl);

//   return (
//     <div className={style.card}>
//       <div className={`${style.imageWrapper} ${!hasImage ? style.noImage : ""}`}>
//         {hasImage ? (
//           <img
//             src={photoUrl}
//             alt={name}
//             loading="lazy"
//             className={style.image}
//           />
//         ) : (
//           <div className={style.placeholder}>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className={style.placeholderIcon}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M3.75 6.75h16.5m-16.5 0a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5m-16.5 0v10.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V6.75m-3 7.5-2.25-3-1.875 2.25L9 9l-3.75 5.25"
//               />
//             </svg>
//             <p>No image</p>
//           </div>
//         )}
//       </div>

//       <div className={style.content}>
//         <h3 className={style.name}>{name}</h3>
//         {type && <p className={style.type}>{type}</p>}
//         <p className={style.info}>
//           {address?.city && <span>{address.city}, </span>}
//           {address?.country}
//         </p>
//         {phoneNumber && <p className={style.phone}>📞 {phoneNumber}</p>}
//         {email && <p className={style.email}>✉️ {email}</p>}
//         {website && (
//           <a href={website} target="_blank" rel="noopener noreferrer" className={style.link}>
//             Visit Website →
//           </a>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HospitalCard;