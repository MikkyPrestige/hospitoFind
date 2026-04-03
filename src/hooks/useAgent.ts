import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import type {
  AgentState,
  Message,
  ChatResponse,
  MatchResponse,
  PatientProfile,
} from '@/src/types/agent';
import type { HospitalContext } from '@/components/agent/AgentWidget';

const INITIAL_STATE: AgentState = {
  phase: 'idle',
  messages: [],
  profile: null,
  hospitals: [],
  error: null,
  noResultsRegion: null,
  noResultsMessage: null,
  contextLocation: null,
};

const GREETING: Message = {
  role: 'assistant',
  content: "👋 Hi there! I'm HospitoFind's care assistant. I'll help match you with the right hospital. What symptoms or health concerns are you experiencing today?",
};

/**
 * Build a context-aware greeting when user arrives from a hospital profile page.
 * Includes the hospital name and location so the agent knows where they are.
 */
const buildContextGreeting = (ctx: HospitalContext): Message => {
  const location = [ctx.city, ctx.country].filter(Boolean).join(', ');
  const locationPart = location ? ` in **${location}**` : '';
  return {
    role: 'assistant',
    content: `👋 I see you're interested in **${ctx.name}**${locationPart}. I'll help match you with the best hospital for your needs. What symptoms or health concerns are you experiencing today?`,
  };
};

export const useAgent = () => {
  const [state, setState] = useState<AgentState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);

  const update = useCallback((patch: Partial<AgentState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  // ── Standard start ────────────────────────────────────────────────────────
  const startConversation = useCallback(() => {
    setState({
      ...INITIAL_STATE,
      phase: 'chatting',
      messages: [GREETING],
      contextLocation: null,
    });
  }, []);

  // ── Context-aware start (from hospital profile page) ──────────────────────
  // Stores the hospital's location in state so sendMessage can pass it
  // to the backend as userLocation — preventing the agent from asking again
  const startConversationWithContext = useCallback((ctx: HospitalContext) => {
    const location = [ctx.city, ctx.country].filter(Boolean).join(', ');
    setState({
      ...INITIAL_STATE,
      phase: 'chatting',
      messages: [buildContextGreeting(ctx)],
      contextLocation: location || null,  // ← stored here, used in sendMessage
    });
  }, []);

  // ── Send a user message ───────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = { role: 'user', content: content.trim() };
      const updatedMessages: Message[] = [...state.messages, userMessage];

      setState((prev) => ({ ...prev, messages: updatedMessages, error: null }));
      setIsLoading(true);

      try {
        // Priority: contextLocation (from hospital page) → localStorage → undefined
        // contextLocation is set when user arrives via "Match Me Here" button
        // so the agent already knows their location and won't ask again
        const userLocation =
          state.contextLocation ||
          localStorage.getItem('userCity') ||
          undefined;

        const apiMessages = updatedMessages
          .filter((m) => !(m.role === 'assistant' && m.content.startsWith('👋')))
          .map(({ role, content }) => ({ role, content }));

        const { data } = await api.post<ChatResponse>('/agent/chat', {
          messages: apiMessages,
          userLocation,
        });

        if (data.type === 'MATCH_READY' && data.profile) {
          await runMatch(data.profile, updatedMessages);
        } else if (data.type === 'MESSAGE' && data.message) {
          setState((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              { role: 'assistant', content: data.message! },
            ],
          }));
        }
      } catch (err: any) {
        update({
          error:
            err?.response?.data?.message ||
            'Something went wrong. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [state.messages, state.contextLocation, isLoading, update]
  );

  // ── Run hospital matching ─────────────────────────────────────────────────
  const runMatch = useCallback(
    async (profile: PatientProfile, currentMessages: Message[]) => {
      const transitionMessage: Message = {
        role: 'assistant',
        content: `Perfect, thank you! 🔍 Finding the best hospitals for you in **${profile.location}**...`,
      };

      setState((prev) => ({
        ...prev,
        phase: 'matching',
        messages: [...currentMessages, transitionMessage],
        profile,
        noResultsRegion: null,
        noResultsMessage: null,
      }));

      try {
        const { data } = await api.post<MatchResponse>('/agent/match', {
          symptoms: profile.symptoms,
          location: profile.location,
          additionalNeeds: profile.additionalNeeds,
        });

        if (data.noResults) {
          setState((prev) => ({
            ...prev,
            phase: 'no_results',
            hospitals: [],
            noResultsRegion: data.region || 'your area',
            noResultsMessage:
              data.message || "We couldn't find hospitals in your area yet.",
          }));
          return;
        }

        setState((prev) => ({
          ...prev,
          phase: 'results',
          hospitals: data.hospitals,
          noResultsRegion: null,
          noResultsMessage: null,
        }));
      } catch (err: any) {
        update({
          phase: 'error',
          error: 'Could not find hospitals right now. Please try again.',
        });
      }
    },
    [update]
  );

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    setIsLoading(false);
  }, []);

  const startOver = useCallback(() => {
    startConversation();
    setIsLoading(false);
  }, [startConversation]);

  return {
    ...state,
    isLoading,
    startConversation,
    startConversationWithContext,
    sendMessage,
    reset,
    startOver,
  };
};
