import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiExternalLink, FiPhone, FiMail, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { HospitalCardProps } from "@/types/hospital";
import style from "./styles/hospitalCard.module.css";

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
  const { name, type, address, phoneNumber, email, website, photoUrl } = hospital;
  const hasImage = Boolean(photoUrl);

  return (
    <article className={style.card}>
      <div className={`${style.imageWrapper} ${!hasImage ? style.noImage : ""}`}>
        <div className={style.badgeOverlay}>
          {type && <span className={style.typeTag}>{type}</span>}
          <span className={style.verifiedBadge}>
            <FiCheckCircle /> Verified
          </span>
        </div>

        {hasImage ? (
          <img
            src={photoUrl}
            alt={`Healthcare facility ${name} in ${address.city}`}
            loading="lazy"
            className={style.image}
          />
        ) : (
          <div className={style.placeholder}>
            <svg viewBox="0 0 24 24" className={style.placeholderIcon} fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className={style.noImageText}>Image Not Available</span>
          </div>
        )}
      </div>

      <div className={style.content}>
        <div className={style.mainInfo}>
          <h2 className={style.name} title={name}>{name}</h2>

          <div className={style.location}>
            <FiMapPin className={style.icon} />
            <span className={style.addressText}>
              {address?.city && <span>{address.city}, </span>}
              {address?.country}
            </span>
          </div>
        </div>

        <div className={style.contactGrid}>
          {phoneNumber && (
            <div className={style.contactItem}>
              <FiPhone className={style.icon} /> <span className={style.phoneText}>{phoneNumber}</span>
            </div>
          )}
          {email && (
            <div className={style.contactItem}>
              <FiMail className={style.icon} /> <span className={style.emailText}>{email}</span>
            </div>
          )}
        </div>

        <div className={style.actions}>
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className={style.websiteLink}
            >
              Official Website <FiExternalLink />
            </a>
          )}

          <Link
            to={`/hospital/${encodeURIComponent(address.country || "location")}/${encodeURIComponent(address.city)}/${hospital.slug || hospital._id}`}
            className={style.profileBtn}
          >
            Full Profile <FiArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default HospitalCard;