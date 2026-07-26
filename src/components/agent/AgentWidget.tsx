import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  FiX,
  FiSend,
  FiMessageCircle,
  FiRefreshCw,
  FiUser,
  FiThumbsUp,
  FiThumbsDown,
} from 'react-icons/fi'
import { useAgent } from '@/hooks/useAgent'
import { useChatFeedback } from '@/hooks/useChatFeedback'
import HospitalMatchCards from './HospitalMatchCards'
import type {
  AgentVariant,
  HospitalContext,
  ChatPanelProps,
  AgentWidgetProps,
} from '@/types/agent'
import style from './styles/widget/AgentWidget.module.scss'

const TypingIndicator = () => (
  <div className={style.typingIndicator}>
    <span />
    <span />
    <span />
  </div>
)

const MessageBubble = ({
  role,
  content,
  messageId,
  onThumbUp,
  onThumbDown,
  pendingRating,
}: {
  role: string
  content: string
  messageId?: string
  hospitalId?: string
  onThumbUp?: () => void
  onThumbDown?: () => void
  pendingRating?: 'up' | 'down'
}) => (
  <div className={`${style.bubble} ${style[role]}`}>
    {role === 'assistant' && (
      <div className={style.avatar}>
        <FiUser />
      </div>
    )}
    <div className={style.bubbleContent}>
      {content
        .split(/(\*\*[^*]+\*\*)/)
        .map((part, i) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={i}>{part.slice(2, -2)}</strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}

      {/* Feedback buttons for assistant messages */}
      {role === 'assistant' && messageId && onThumbUp && onThumbDown && (
        <div className={style.feedbackBtns}>
          <button
            type="button"
            onClick={onThumbUp}
            disabled={pendingRating === 'up'}
            className={`${style.thumbBtn} ${pendingRating === 'up' ? style.active : ''}`}
            aria-label="Thumbs up"
          >
            <FiThumbsUp size={14} />
          </button>
          <button
            type="button"
            onClick={onThumbDown}
            disabled={pendingRating === 'down'}
            className={`${style.thumbBtn} ${pendingRating === 'down' ? style.active : ''}`}
            aria-label="Thumbs down"
          >
            <FiThumbsDown size={14} />
          </button>
        </div>
      )}
    </div>
  </div>
)

const ChatPanel = ({
  variant,
  phase,
  messages,
  profile,
  hospitals,
  error,
  isLoading,
  inputValue,
  inputRef,
  messagesContainerRef,
  noResults,
  noResultsMessage,
  noResultsRegion,
  onInputChange,
  onKeyDown,
  onSend,
  onStartOver,
  onClose,
  onThumbUp,
  onThumbDown,
  pendingFeedback,
}: ChatPanelProps) => {
  const lastAssistantMsg = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant')
  const feedbackMessageId = lastAssistantMsg?.id ?? ''

  return (
    <div className={`${style.panel} ${style[`panel_${variant}`]}`}>
      <div className={`${style.panelHeader} ${style[`header_${variant}`]}`}>
        <div className={style.headerLeft}>
          <div className={style.headerAvatar}>
            <FiUser />
          </div>
          <div className={style.headerInfo}>
            <p className={style.headerName}>HospitoFind Assistant</p>
            <p className={style.headerStatus}>
              <span className={style.statusDot} />
              Online
            </p>
          </div>
        </div>
        <div className={style.headerActions}>
          {phase !== 'idle' && (
            <button
              type="button"
              className={style.iconBtn}
              onClick={onStartOver}
              title="Start over"
              aria-label="Start new conversation"
            >
              <FiRefreshCw size={15} />
            </button>
          )}
          {variant === 'floating' && (
            <button
              type="button"
              className={style.iconBtn}
              onClick={onClose}
              title="Close"
              aria-label="Close assistant"
            >
              <FiX size={17} />
            </button>
          )}
        </div>
      </div>

      <div className={style.body}>
        {phase === 'results' || phase === 'no_results' ? (
          <HospitalMatchCards
            hospitals={hospitals}
            profile={profile}
            onStartOver={onStartOver}
            noResults={noResults}
            noResultsMessage={noResultsMessage}
            noResultsRegion={noResultsRegion}
            onThumbUp={
              onThumbUp && feedbackMessageId
                ? () => onThumbUp(feedbackMessageId)
                : undefined
            }
            onThumbDown={
              onThumbDown && feedbackMessageId
                ? () => onThumbDown(feedbackMessageId)
                : undefined
            }
            pendingRating={
              feedbackMessageId
                ? pendingFeedback?.[feedbackMessageId]
                : undefined
            }
          />
        ) : (
          <>
            <div className={style.messages} ref={messagesContainerRef}>
              <div className={style.messagesSpacer} />
              {messages.map((msg, index) => {
                const isLastAssistant =
                  msg.role === 'assistant' &&
                  index === messages.length - 1 &&
                  (phase === 'results' || phase === 'no_results')

                return (
                  <MessageBubble
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    messageId={isLastAssistant ? msg.id : undefined}
                    onThumbUp={
                      isLastAssistant ? () => onThumbUp?.(msg.id) : undefined
                    }
                    onThumbDown={
                      isLastAssistant ? () => onThumbDown?.(msg.id) : undefined
                    }
                    pendingRating={
                      isLastAssistant ? pendingFeedback?.[msg.id] : undefined
                    }
                  />
                )
              })}

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
                  <button type="button" onClick={onStartOver}>
                    Try again
                  </button>
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
  )
}

//  Main widget
const AgentWidget = ({
  variant: variantProp,
  embedded,
  onSessionComplete,
  onStartOver: onStartOverProp,
  hospitalContext,
}: AgentWidgetProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { sendFeedback, pending } = useChatFeedback()
  const variant: AgentVariant = variantProp ?? (embedded ? 'hero' : 'floating')
  const isEmbedded = variant !== 'floating'
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hospitalContextRef = useRef<HospitalContext | null | undefined>(
    hospitalContext
  )

  useEffect(() => {
    hospitalContextRef.current = hospitalContext
  }, [hospitalContext])

  const startedRef = useRef(false)

  const handleThumbUp = (messageId: string) => sendFeedback(messageId, 'up')
  const handleThumbDown = (messageId: string) => sendFeedback(messageId, 'down')

  const {
    phase,
    messages,
    profile,
    hospitals,
    error,
    isLoading,
    noResultsRegion,
    noResultsMessage,
    startConversation,
    startConversationWithContext,
    sendMessage,
    startOver,
    reset,
  } = useAgent()

  const prevPhaseRef = useRef<string>('')
  useEffect(() => {
    if (
      prevPhaseRef.current === 'results' &&
      phase === 'chatting' &&
      onSessionComplete
    ) {
      onSessionComplete()
    }
    prevPhaseRef.current = phase
  }, [phase, onSessionComplete])

  const scrollToBottom = useCallback(() => {
    const el = messagesContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  useEffect(() => {
    if ((isOpen || isEmbedded) && phase === 'chatting') {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isEmbedded, phase])

  const startWithContext = useCallback(() => {
    if (startedRef.current) return
    startedRef.current = true

    // Priority 1: URL query params (guest redirect from hospital page)
    const params = new URLSearchParams(window.location.search)
    const hospitalName = params.get('hospital')
    if (hospitalName) {
      startConversationWithContext({
        name: hospitalName,
        city: params.get('city') || undefined,
        country: params.get('country') || undefined,
      })
      navigate(location.pathname, { replace: true })
      return
    }

    // Priority 2: hospitalContext prop (dashboard logged-in flow)
    const ctx = hospitalContextRef.current
    if (ctx?.name) {
      startConversationWithContext(ctx)
      return
    }

    // Priority 3: Standard greeting
    startConversation()
  }, [
    startConversation,
    startConversationWithContext,
    navigate,
    location.pathname,
  ])

  //  Auto-start
  useEffect(() => {
    if (!isEmbedded || phase !== 'idle' || startedRef.current) return

    if (variant === 'dashboard') {
      if (hospitalContext !== undefined) {
        startWithContext()
      }
    } else {
      startWithContext()
    }
  }, [isEmbedded, phase, variant, hospitalContext, startWithContext])

  const handleStartOver = useCallback(() => {
    startedRef.current = false
    onStartOverProp?.()
    startOver()
  }, [onStartOverProp, startOver])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    if (phase === 'idle') startConversation()
  }, [phase, startConversation])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    reset()
  }, [reset])

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isLoading) return
    sendMessage(inputValue)
    setInputValue('')
  }, [inputValue, isLoading, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const panelProps = {
    variant,
    phase,
    messages,
    profile,
    hospitals,
    error,
    isLoading,
    inputValue,
    inputRef,
    messagesContainerRef,
    noResults: phase === 'no_results',
    noResultsMessage: noResultsMessage ?? null,
    noResultsRegion: noResultsRegion ?? null,
    onInputChange: setInputValue,
    onKeyDown: handleKeyDown,
    onSend: handleSend,
    onStartOver: handleStartOver,
    onClose: handleClose,
    onThumbUp: handleThumbUp,
    onThumbDown: handleThumbDown,
    pendingFeedback: pending,
  }

  if (isEmbedded) {
    return (
      <div
        className={`${style.embeddedWrapper} ${style[`wrapper_${variant}`]}`}
      >
        <ChatPanel {...panelProps} />
      </div>
    )
  }

  return (
    <div className={style.floatingWrapper}>
      {!isOpen && (
        <button
          type="button"
          className={style.floatingBtn}
          onClick={handleOpen}
          aria-label="Open health assistant"
        >
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
  )
}

export default AgentWidget
