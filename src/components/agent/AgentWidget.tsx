import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiX, FiSend, FiMessageCircle, FiRefreshCw, FiUser } from 'react-icons/fi';
import { useAgent } from '@/hooks/useAgent';
import HospitalMatchCards from './HospitalMatchCards';
import style from './styles/widget/AgentWidget.module.scss';
import type { Message, PatientProfile, HospitalMatch } from '@/src/types/agent';

export type AgentVariant = 'hero' | 'dashboard' | 'floating';

export interface HospitalContext {
    name: string;
    city?: string;
    country?: string;
}

const TypingIndicator = () => (
    <div className={style.typingIndicator}>
        <span /><span /><span />
    </div>
);

const MessageBubble = ({ role, content }: { role: string; content: string }) => (
    <div className={`${style.bubble} ${style[role]}`}>
        {role === 'assistant' && <div className={style.avatar}><FiUser /></div>}
        <div className={style.bubbleContent}>
            {content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                part.startsWith('**') && part.endsWith('**')
                    ? <strong key={i}>{part.slice(2, -2)}</strong>
                    : <span key={i}>{part}</span>
            )}
        </div>
    </div>
);

interface ChatPanelProps {
    variant: AgentVariant;
    phase: string;
    messages: Message[];
    profile: PatientProfile | null;
    hospitals: HospitalMatch[];
    error: string | null;
    isLoading: boolean;
    inputValue: string;
    inputRef: React.RefObject<HTMLInputElement>;
    messagesContainerRef: React.RefObject<HTMLDivElement>;
    noResults: boolean;
    noResultsMessage: string | null;
    noResultsRegion: string | null;
    onInputChange: (val: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onSend: () => void;
    onStartOver: () => void;
    onClose: () => void;
}

const ChatPanel = ({
    variant, phase, messages, profile, hospitals, error, isLoading,
    inputValue, inputRef, messagesContainerRef, noResults, noResultsMessage,
    noResultsRegion, onInputChange, onKeyDown, onSend, onStartOver, onClose,
}: ChatPanelProps) => (
    <div className={`${style.panel} ${style[`panel_${variant}`]}`}>
        <div className={`${style.panelHeader} ${style[`header_${variant}`]}`}>
            <div className={style.headerLeft}>
                <div className={style.headerAvatar}><FiUser /></div>
                <div>
                    <p className={style.headerName}>HospitoFind Assistant</p>
                    <p className={style.headerStatus}>
                        <span className={style.statusDot} />
                        Online
                    </p>
                </div>
            </div>
            <div className={style.headerActions}>
                {phase !== 'idle' && (
                    <button type="button" className={style.iconBtn} onClick={onStartOver}
                        title="Start over" aria-label="Start new conversation">
                        <FiRefreshCw size={15} />
                    </button>
                )}
                {variant === 'floating' && (
                    <button type="button" className={style.iconBtn} onClick={onClose}
                        title="Close" aria-label="Close assistant">
                        <FiX size={17} />
                    </button>
                )}
            </div>
        </div>

        <div className={style.body}>
            {(phase === 'results' || phase === 'no_results') ? (
                <HospitalMatchCards
                    hospitals={hospitals}
                    profile={profile}
                    onStartOver={onStartOver}
                    noResults={noResults}
                    noResultsMessage={noResultsMessage}
                    noResultsRegion={noResultsRegion}
                />
            ) : (
                <>
                    <div className={style.messages} ref={messagesContainerRef}>
                        <div className={style.messagesSpacer} />
                        {messages.map((msg, i) => (
                            <MessageBubble key={i} role={msg.role} content={msg.content} />
                        ))}
                        {phase === 'matching' && (
                            <div className={style.matchingState}>
                                <div className={style.matchingSpinner} />
                                <p>Searching hospitals near you...</p>
                            </div>
                        )}
                        {isLoading && phase === 'chatting' && <TypingIndicator />}
                        {error && (
                            <div className={style.errorMsg}>
                                <p>{error}</p>
                                <button type="button" onClick={onStartOver}>Try again</button>
                            </div>
                        )}
                        <div className={style.scrollAnchor} />
                    </div>

                    {(phase === 'chatting' || phase === 'idle') && (
                        <div className={style.inputBar}>
                            <input
                                ref={inputRef}
                                type="text"
                                className={style.input}
                                placeholder="Describe your symptoms..."
                                value={inputValue}
                                onChange={(e) => onInputChange(e.target.value)}
                                onKeyDown={onKeyDown}
                                disabled={isLoading}
                                aria-label="Type your message"
                                maxLength={500}
                            />
                            <button
                                type="button"
                                className={style.sendBtn}
                                onClick={onSend}
                                disabled={!inputValue.trim() || isLoading}
                                aria-label="Send message"
                            >
                                <FiSend size={16} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    </div>
);

//  Main widget
interface AgentWidgetProps {
    variant?: AgentVariant;
    embedded?: boolean;
    onSessionComplete?: () => void;
    onStartOver?: () => void;
    hospitalContext?: HospitalContext | null;
}

const AgentWidget = ({
    variant: variantProp,
    embedded,
    onSessionComplete,
    onStartOver: onStartOverProp,
    hospitalContext,
}: AgentWidgetProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const variant: AgentVariant = variantProp ?? (embedded ? 'hero' : 'floating');
    const isEmbedded = variant !== 'floating';

    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const hospitalContextRef = useRef<HospitalContext | null | undefined>(hospitalContext);
    useEffect(() => {
        hospitalContextRef.current = hospitalContext;
    }, [hospitalContext]);

    // Prevents starting the conversation more than once per session
    const startedRef = useRef(false);

    const {
        phase, messages, profile, hospitals,
        error, isLoading, noResultsRegion, noResultsMessage,
        startConversation, startConversationWithContext,
        sendMessage, startOver, reset,
    } = useAgent();

    // Fire onSessionComplete when user starts new conversation after results
    const prevPhaseRef = useRef<string>('');
    useEffect(() => {
        if (prevPhaseRef.current === 'results' && phase === 'chatting' && onSessionComplete) {
            onSessionComplete();
        }
        prevPhaseRef.current = phase;
    }, [phase, onSessionComplete]);

    const scrollToBottom = useCallback(() => {
        const el = messagesContainerRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, []);
    useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

    useEffect(() => {
        if ((isOpen || isEmbedded) && phase === 'chatting') {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isEmbedded, phase]);

    //  Core start function
    const startWithContext = useCallback(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        // Priority 1: URL query params (guest redirect from hospital page)
        const params = new URLSearchParams(window.location.search);
        const hospitalName = params.get('hospital');
        if (hospitalName) {
            startConversationWithContext({
                name: hospitalName,
                city: params.get('city') || undefined,
                country: params.get('country') || undefined,
            });
            navigate(location.pathname, { replace: true });
            return;
        }

        // Priority 2: hospitalContext prop (dashboard logged-in flow)
        const ctx = hospitalContextRef.current;
        if (ctx?.name) {
            startConversationWithContext(ctx);
            return;
        }

        // Priority 3: Standard greeting
        startConversation();
    }, [startConversation, startConversationWithContext, navigate, location.pathname]);
    // Note: hospitalContext intentionally NOT in deps — read via ref instead

    //  Auto-start
    useEffect(() => {
        if (!isEmbedded || phase !== 'idle' || startedRef.current) return;

        if (variant === 'dashboard') {
            if (hospitalContext !== undefined) {
                startWithContext();
            }
        } else {
            startWithContext();
        }
    }, [isEmbedded, phase, variant, hospitalContext, startWithContext]);

    const handleStartOver = useCallback(() => {
        startedRef.current = false;
        onStartOverProp?.();
        startOver();
    }, [onStartOverProp, startOver]);

    const handleOpen = useCallback(() => {
        setIsOpen(true);
        if (phase === 'idle') startConversation();
    }, [phase, startConversation]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        reset();
    }, [reset]);

    const handleSend = useCallback(() => {
        if (!inputValue.trim() || isLoading) return;
        sendMessage(inputValue);
        setInputValue('');
    }, [inputValue, isLoading, sendMessage]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    const panelProps = {
        variant, phase, messages, profile, hospitals, error, isLoading,
        inputValue, inputRef, messagesContainerRef,
        noResults: phase === 'no_results',
        noResultsMessage: noResultsMessage ?? null,
        noResultsRegion: noResultsRegion ?? null,
        onInputChange: setInputValue,
        onKeyDown: handleKeyDown,
        onSend: handleSend,
        onStartOver: handleStartOver,
        onClose: handleClose,
    };

    if (isEmbedded) {
        return (
            <div className={`${style.embeddedWrapper} ${style[`wrapper_${variant}`]}`}>
                <ChatPanel {...panelProps} />
            </div>
        );
    }

    return (
        <div className={style.floatingWrapper}>
            {!isOpen && (
                <button type="button" className={style.floatingBtn} onClick={handleOpen}
                    aria-label="Open health assistant">
                    <FiMessageCircle size={24} />
                    <span className={style.floatingLabel}>Find Care</span>
                </button>
            )}
            {isOpen && (
                <div className={style.floatingPanel}>
                    <ChatPanel {...panelProps} />
                </div>
            )}
        </div>
    );
};

export default AgentWidget;