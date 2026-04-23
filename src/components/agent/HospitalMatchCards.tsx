import { Link } from 'react-router-dom';
import { FiPhone, FiMapPin, FiExternalLink, FiCheckCircle, FiStar, FiSearch } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import type { HospitalMatchCardsProps } from '@/types/agent';
import HospitalPic from '@/assets/images/hospital-logo.jpg';
import style from './styles/cards/HospitalMatchCards.module.scss';

const ScoreBadge = ({ score }: { score: number }) => {
    const level =
        score >= 90 ? 'excellent' :
            score >= 70 ? 'good' :
                'fair';

    return (
        <span className={`${style.badge} ${style[level]}`}>
            <FiStar size={11} />
            {score}% match
        </span>
    );
};

const HospitalMatchCards = ({
    hospitals,
    profile,
    onStartOver,
    noResults = false,
    noResultsRegion,
    noResultsMessage,
}: HospitalMatchCardsProps) => {

    if (noResults) {
        return (
            <div className={style.noResults}>
                <div className={style.noResultsIcon}>
                    <HiSparkles size={28} />
                </div>
                <h3 className={style.noResultsTitle}>
                    No hospitals found in {noResultsRegion || 'your area'}
                </h3>
                <p className={style.noResultsText}>
                    {noResultsMessage ||
                        `Our coverage in ${noResultsRegion || 'your area'} is still growing. Check back soon or browse our full directory.`}
                </p>
                <div className={style.noResultsActions}>
                    <Link to="/find-hospital" className={style.directoryBtn}>
                        <FiSearch size={14} />
                        Browse Full Directory
                    </Link>
                    <button
                        type="button"
                        className={style.retryBtn}
                        onClick={onStartOver}
                    >
                        Try a different location
                    </button>
                </div>
            </div>
        );
    }

    if (!hospitals.length) {
        return (
            <div className={style.empty}>
                <p>No hospitals found matching your criteria.</p>
                <button type="button" className={style.retryBtn} onClick={onStartOver}>
                    Try again
                </button>
            </div>
        );
    }

    //  Results
    return (
        <div className={style.wrapper}>
            <div className={style.header}>
                <div className={style.headerText}>
                    <h3 className={style.title}>Top matches for you</h3>
                    {profile && (
                        <p className={style.subtitle}>
                            Based on <strong>{profile.symptoms.join(', ')}</strong> near{' '}
                            <strong>{profile.location}</strong>
                        </p>
                    )}
                </div>
                <button type="button" className={style.startOverBtn} onClick={onStartOver}>
                    New search
                </button>
            </div>

            <div className={style.cards}>
                {hospitals.map((hospital, index) => (
                    <div key={hospital._id} className={style.card}>
                        <div className={style.rank}>#{index + 1}</div>
                        <div className={style.imgWrapper}>
                            <img
                                src={hospital.photoUrl || HospitalPic}
                                alt={hospital.name}
                                className={style.img}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = HospitalPic;
                                }}
                            />
                        </div>

                        <div className={style.info}>
                            <div className={style.nameRow}>
                                <h4 className={style.name}>{hospital.name}</h4>
                                {hospital.verified && (
                                    <FiCheckCircle size={14} className={style.verified} title="Verified facility" />
                                )}
                            </div>

                            <div className={style.meta}>
                                <span className={style.type}>{hospital.type}</span>
                                <ScoreBadge score={hospital.matchScore} />
                            </div>

                            <div className={style.location}>
                                <FiMapPin size={12} />
                                <span>{hospital.city}, {hospital.state}</span>
                            </div>

                            <p className={style.reason}>{hospital.matchReason}</p>

                            <div className={style.actions}>
                                {hospital.phoneNumber && (
                                    <a
                                        href={`tel:${hospital.phoneNumber.split(',')[0].trim()}`}
                                        className={style.callBtn}
                                        title="Call hospital"
                                    >
                                        <FiPhone size={13} />
                                        Call
                                    </a>
                                )}
                                <Link
                                    to={`/hospital/${hospital.state}/${hospital.city}/${hospital.slug}`}
                                    className={style.profileBtn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Profile
                                    <FiExternalLink size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HospitalMatchCards;
