import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    FiTrash2, FiStar, FiAlertCircle,
    FiActivity, FiChevronDown, FiChevronUp, FiCheck, FiClock,
    FiPlusSquare
} from 'react-icons/fi';
import { HiSparkles, HiOutlineMapPin } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import { useHealthHistory } from '@/hooks/useHealthHistory';
import { HospitalContext } from "@/types/agent";
import { HealthSession, FeedbackPayload } from "@/types/healthHistory";
import AgentWidget from '@/components/agent/AgentWidget';
import style from './styles/scss/healthTimeline/HealthTimeline.module.scss';

const LS_PROMPTED = 'hf_feedback_prompted';
const LS_DISMISSED = 'hf_feedback_dismissed';

const getLocalList = (key: string): string[] =>
    JSON.parse(localStorage.getItem(key) || '[]');

const addToLocalList = (key: string, id: string) => {
    const list = getLocalList(key);
    if (!list.includes(id)) {
        localStorage.setItem(key, JSON.stringify([...list, id]));
    }
};

const StarRating = ({
    value,
    onChange,
}: {
    value: number | null;
    onChange: (rating: number) => void;
}) => (
    <div className={style.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                className={`${style.star} ${value && value >= star ? style.starFilled : ''}`}
                onClick={() => onChange(star)}
                aria-label={`Rate ${star} stars`}
            >
                <FiStar size={14} />
            </button>
        ))}
    </div>
);

interface FeedbackPromptProps {
    session: HealthSession;
    onSubmit: (sessionId: string, payload: FeedbackPayload) => Promise<void>;
}

const FeedbackPrompt = ({ session, onSubmit }: FeedbackPromptProps) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
    const [rating, setRating] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const dismissed = getLocalList(LS_DISMISSED);
    if (session.hospitalVisited || session.rating || submitted || dismissed.includes(session._id)) return null;
    if (!session.matchedHospitals?.length) return null;

    const handleSubmit = async () => {
        if (!selectedHospital && !rating) return;
        setSubmitting(true);

        if (selectedHospital === 'none' && !rating) {
            addToLocalList(LS_DISMISSED, session._id);
            addToLocalList(LS_PROMPTED, session._id);
            setSubmitted(true);
            setSubmitting(false);
            return;
        }

        const payload: FeedbackPayload = {};
        if (selectedHospital && selectedHospital !== 'none') payload.hospitalVisited = selectedHospital;
        if (rating) payload.rating = rating;

        await onSubmit(session._id, payload);
        addToLocalList(LS_PROMPTED, session._id);
        setSubmitted(true);
        setSubmitting(false);
    };

    return (
        <div className={style.feedbackPrompt}>
            <button type="button" className={style.feedbackTrigger} onClick={() => setExpanded(!expanded)}>
                <div className={style.triggerContent}>
                    <span className={style.feedbackTriggerDot} />
                    <span>Quick Update: How did your visit go?</span>
                </div>
                {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            </button>

            {expanded && (
                <div className={style.feedbackForm}>
                    <div className={style.formSection}>
                        <p className={style.feedbackLabel}>Hospital visited</p>
                        <div className={style.hospitalPills}>
                            {session.matchedHospitals.map((m) => {
                                const id = typeof m.hospitalId === 'object' && m.hospitalId !== null
                                    ? m.hospitalId._id : String(m.hospitalId);
                                const isSelected = selectedHospital === id;
                                return (
                                    <button key={id} type="button"
                                        className={`${style.pill} ${isSelected ? style.pillSelected : ''}`}
                                        onClick={() => setSelectedHospital(id)}>
                                        {isSelected && <FiCheck size={12} />}
                                        {m.name}
                                    </button>
                                );
                            })}
                            <button type="button"
                                className={`${style.pill} ${selectedHospital === 'none' ? style.pillSelected : ''}`}
                                onClick={() => setSelectedHospital('none')}>
                                None
                            </button>
                        </div>
                    </div>

                    <div className={style.formSection}>
                        <p className={style.feedbackLabel}>Rate experience</p>
                        <StarRating value={rating} onChange={setRating} />
                    </div>

                    <button type="button" className={style.feedbackSubmit} onClick={handleSubmit}
                        disabled={submitting || (!selectedHospital && !rating)}>
                        {submitting ? 'Saving...' : 'Submit Feedback'}
                    </button>
                </div>
            )}
        </div>
    );
};

const PatternAlert = ({ symptoms }: { symptoms: string[] }) => (
    <div className={style.patternAlert}>
        <div className={style.alertPulse} />
        <FiAlertCircle size={20} className={style.alertIcon} />
        <p>Repeated pattern: <strong>{symptoms.join(', ')}</strong>. Consider discussing this recurrence with a doctor.</p>
    </div>
);

const detectPatterns = (history: HealthSession[]): string[] => {
    if (history.length < 3) return [];
    const counts: Record<string, number> = {};
    history.forEach((s) => {
        s.symptoms.forEach((sym) => {
            counts[sym.toLowerCase()] = (counts[sym.toLowerCase()] || 0) + 1;
        });
    });
    return Object.entries(counts).filter(([, count]) => count >= 3).map(([sym]) => sym);
};

const SessionCard = ({
    session, onFeedback, onDelete,
}: {
    session: HealthSession;
    onFeedback: (id: string, payload: FeedbackPayload) => Promise<void>;
    onDelete: (id: string) => void;
}) => {
    const [expanded, setExpanded] = useState(false);
    const date = new Date(session.date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
    });

    return (
        <div className={style.card}>
            <div className={style.cardHeader}>
                <div className={style.headerMain}>
                    <div className={style.dateBox}>
                        <FiClock size={11} />
                        <span className={style.cardDate}>{date}</span>
                    </div>
                    <div className={style.symptoms}>
                        {session.symptoms.map((s) => (
                            <span key={s} className={style.symptomTag}>{s}</span>
                        ))}
                    </div>
                </div>
                <div className={style.cardActions}>
                    {session.rating && (
                        <div className={style.ratingDisplay}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FiStar key={star} size={11}
                                    className={session.rating && session.rating >= star ? style.starFilledDisplay : style.starEmptyDisplay}
                                />
                            ))}
                        </div>
                    )}
                    <button type="button" className={style.deleteBtn} onClick={() => onDelete(session._id)} aria-label="Delete session">
                        <FiTrash2 size={14} />
                    </button>
                </div>
            </div>

            <div className={style.cardBody}>
                <div className={style.location}>
                    <HiOutlineMapPin size={14} />
                    <span>{session.location}</span>
                </div>

                {session.hospitalVisited && (
                    <div className={style.visitedContainer}>
                        <div className={style.visitLine} />
                        <div className={style.visitedBadge}>
                            <FiCheck size={12} />
                            <span>Visited: </span>
                            <Link to={`/hospital/${session.hospitalVisited.address?.state}/${session.hospitalVisited.address?.city}/${session.hospitalVisited.slug}`} className={style.visitedLink}>
                                {session.hospitalVisited.name}
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {session.matchedHospitals?.length > 0 && (
                <div className={style.matchWrapper}>
                    <button type="button" className={style.expandBtn} onClick={() => setExpanded(!expanded)}>
                        <span>Matches ({session.matchedHospitals.length})</span>
                        {expanded ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                    </button>
                    {expanded && (
                        <div className={style.matchedList}>
                            {session.matchedHospitals.map((m, i) => (
                                <div key={i} className={style.matchedItem}>
                                    <div className={style.matchInfo}>
                                        <span className={style.matchName}>{m.name}</span>
                                        <span className={style.matchScore}>{m.matchScore}% relevance</span>
                                    </div>
                                    <div className={style.scoreBar} style={{ '--progress': `${m.matchScore}%` } as any} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <FeedbackPrompt session={session} onSubmit={onFeedback} />
        </div>
    );
};

interface HealthTimelineProps {
    hospitalContext?: HospitalContext | null;
}

const HealthTimeline = ({ hospitalContext }: HealthTimelineProps) => {
    const {
        history, isLoading, error,
        saveFeedback, deleteSession, clearHistory, fetchHistory,
    } = useHealthHistory();

    const [activeContext, setActiveContext] = useState<HospitalContext | null>(
        hospitalContext ?? null
    );

    useEffect(() => {
        if (hospitalContext !== undefined) {
            setActiveContext(hospitalContext ?? null);
        }
    }, [hospitalContext]);

    const toastShownRef = useRef(false);
    const repeatedSymptoms = detectPatterns(history);

    useEffect(() => {
        if (toastShownRef.current || !history.length) return;
        const alreadyPrompted = getLocalList(LS_PROMPTED);
        const alreadyDismissed = getLocalList(LS_DISMISSED);

        const needsFeedback = history.filter(
            (s) => !s.hospitalVisited && !s.rating &&
                !alreadyPrompted.includes(s._id) && !alreadyDismissed.includes(s._id)
        );

        if (needsFeedback.length > 0) {
            toastShownRef.current = true;
            toast.info(`Health check: Tell us about your ${needsFeedback.length} recent visit${needsFeedback.length > 1 ? 's' : ''}.`, {
                toastId: 'feedback-reminder', autoClose: 6000, position: 'top-right'
            });
            needsFeedback.forEach((s) => addToLocalList(LS_PROMPTED, s._id));
        }
    }, [history]);

    const handleFeedback = async (sessionId: string, payload: FeedbackPayload) => {
        const result = await saveFeedback(sessionId, payload);
        if (result.success) {
            toast.success('Feedback updated');
            addToLocalList(LS_DISMISSED, sessionId);
        } else {
            toast.error(result.error || 'Failed to save feedback');
        }
    };

    const handleDelete = async (sessionId: string) => {
        if (!window.confirm('Remove this session from history?')) return;
        const result = await deleteSession(sessionId);
        if (result.success) toast.success('Session deleted');
        else toast.error(result.error || 'Failed to delete');
    };

    const handleClearAll = async () => {
        if (!window.confirm('Permanently clear all health history?')) return;
        const result = await clearHistory();
        if (result.success) {
            toast.success('History cleared');
            localStorage.removeItem(LS_PROMPTED);
            localStorage.removeItem(LS_DISMISSED);
        } else {
            toast.error(result.error || 'Failed to clear history');
        }
    };

    const handleSessionComplete = () => {
        setActiveContext(null);
        fetchHistory();
    };

    if (isLoading) {
        return (
            <div className={style.loadingState}>
                <div className={style.loaderContainer}>
                    <div className={style.pulseLoader} />
                    <div className={style.spinner} />
                </div>
                <p>Syncing health records...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={style.errorState}>
                <div className={style.errorCircle}><FiAlertCircle size={32} /></div>
                <h3>Connection Error</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className={style.retryBtn}>Retry Sync</button>
            </div>
        );
    }

    return (
        <div className={style.wrapper}>
            <header className={style.pageHeader}>
                <div className={style.headerContent}>
                    <div className={style.headerIconBg}>
                        <FiActivity size={20} />
                    </div>
                    <div>
                        <h2 className={style.title}>Health History</h2>
                        <div className={style.statsRow}>
                            <span className={style.statItem}>{history.length} Saved Sessions</span>
                            <span className={style.statDot} />
                            <span className={style.statItem}>Live Sync Active</span>
                        </div>
                    </div>
                </div>
                {history.length > 0 && (
                    <button type="button" className={style.clearBtn} onClick={handleClearAll}>
                        Clear History
                    </button>
                )}
            </header>

            {repeatedSymptoms.length > 0 && <PatternAlert symptoms={repeatedSymptoms} />}

            <div className={style.columns}>
                <section className={style.agentCol}>
                    <div className={style.sectionHeader}>
                        <HiSparkles /> <span>HospitoFind AI Assistant</span>
                    </div>
                    <div className={style.agentWrapper}>
                        {activeContext?.name && (
                            <div className={style.contextBanner}>
                                <div className={style.contextIcon}><FiPlusSquare /></div>
                                <div className={style.contextText}>
                                    Focused on: <strong>{activeContext.name}</strong>
                                    <span>{activeContext.city ? `, ${activeContext.city}` : ''}</span>
                                </div>
                            </div>
                        )}
                        <AgentWidget
                            variant="dashboard"
                            onSessionComplete={handleSessionComplete}
                            onStartOver={() => setActiveContext(null)}
                            hospitalContext={activeContext}
                        />
                    </div>
                </section>

                <section className={style.historyCol}>
                    <div className={style.sectionHeader}>
                        <FiClock /> <span>Timeline Activity</span>
                    </div>

                    {history.length === 0 ? (
                        <div className={style.emptyHistory}>
                            <div className={style.emptyIllustration}>
                                <FiActivity className={style.emptyIcon} />
                                <div className={style.pulseLine} />
                            </div>
                            <h3>No history yet</h3>
                            <p>Complete a session with our AI assistant to start your health timeline.</p>
                        </div>
                    ) : (
                        <div className={style.timeline}>
                            {history.map((session) => (
                                <SessionCard
                                    key={session._id}
                                    session={session}
                                    onFeedback={handleFeedback}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default HealthTimeline;