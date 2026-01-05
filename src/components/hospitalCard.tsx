import React from "react";
import { Link } from "react-router-dom";
import { Hospital } from "../services/hospital";
import style from "./style/hospitalCard.module.css";
import { FiArrowRight, FiExternalLink, FiPhone, FiMail, FiMapPin } from "react-icons/fi";

interface HospitalCardProps {
  hospital: Hospital;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
  const { name, type, address, phoneNumber, email, website, photoUrl } = hospital;
  const hasImage = Boolean(photoUrl);

  return (
    <section className={style.card}>
      <div className={`${style.imageWrapper} ${!hasImage ? style.noImage : ""}`}>
        {hasImage ? (
          <img
            src={photoUrl}
            alt={`Photo of ${name} in ${address.city}`}
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
        <div className={style.mainInfo}>
          <div className={style.header}>
            <h2 className={style.name}>{name}</h2>
            {type && <p className={style.type}>{type}</p>}
          </div>
          <div className={style.addressRow}>
            <FiMapPin className={style.mapIcon} />
            <span className={style.addressText}>
              {address?.city && <span>{address.city}, </span>}
              {address?.country}
            </span>
          </div>
        </div>

        <div className={style.contactInfo}>
          {phoneNumber && (
            <p className={style.phone}>
              <FiPhone className={style.contactIcon} /> {phoneNumber}
            </p>
          )}
          {email && (
            <p className={style.email}>
              <FiMail className={style.contactIcon} /> {email}
            </p>
          )}
        </div>

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className={style.externalLink}
          >
            Visit Website <FiExternalLink className={style.linkIcon} />
          </a>
        )}

        <Link
          to={`/hospital/${encodeURIComponent(address.country || "location")}/${encodeURIComponent(address.city)}/${hospital.slug || hospital._id}`}
          className={style.detailsBtn}
        >
          View Full Profile <FiArrowRight className={style.btnIcon} />
        </Link>
      </div>
    </section>
  );
};

export default HospitalCard;