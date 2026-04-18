export type MessageRole = 'user' | 'assistant';

export interface Message {
  role: MessageRole;
  content: string;
}

export interface PatientProfile {
  symptoms: string[];
  location: string;
  additionalNeeds: string;
}

export interface HospitalMatch {
  _id: string;
  name: string;
  slug: string;
  type: string;
  city: string;
  state: string;
  street: string;
  phoneNumber: string;
  email: string;
  website: string;
  photoUrl: string;
  verified: boolean;
  isFeatured: boolean;
  services: string[];
  latitude: number;
  longitude: number;
  matchScore: number;
  matchReason: string;
}

export type AgentPhase =
  | 'idle'        // widget not yet started
  | 'chatting'    // conversation in progress
  | 'matching'    // fetching hospital matches
  | 'results'     // matched hospitals found and shown
  | 'no_results'  // match ran but nothing found in region
  | 'error';      // something went wrong

export interface AgentState {
  phase: AgentPhase;
  messages: Message[];
  profile: PatientProfile | null;
  hospitals: HospitalMatch[];
  error: string | null;
  noResultsRegion: string | null;
  noResultsMessage: string | null;
  contextLocation: string | null;
}

export interface ChatResponse {
  type: 'MESSAGE' | 'MATCH_READY';
  message?: string;
  profile?: PatientProfile;
}

export interface MatchResponse {
  success: boolean;
  count: number;
  noResults: boolean;
  region?: string;
  message?: string;
  profile: PatientProfile;
  hospitals: HospitalMatch[];
}
