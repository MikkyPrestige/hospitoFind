export interface MatchedHospital {
  hospitalId: {
    _id: string;
    name: string;
    slug: string;
    address: { city: string; state: string };
    photoUrl?: string;
  } | null;
  name: string;
  matchScore: number;
}

export interface HealthSession {
  _id: string;
  date: string;
  symptoms: string[];
  location: string;
  matchedHospitals: MatchedHospital[];
  hospitalVisited: {
    _id: string;
    name: string;
    slug: string;
    address: { city: string; state: string };
  } | null;
  rating: number | null;
  feedback: string | null;
}

export interface FeedbackPayload {
  hospitalVisited?: string;
  rating?: number;
  feedback?: string;
}