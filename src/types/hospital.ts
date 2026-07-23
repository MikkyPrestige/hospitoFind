export interface Address {
  street: string
  city: string
  state: string
  country?: string
  postalCode?: string
}

export interface Hours {
  day: string
  open: string
}

export interface Hospital {
  _id: string
  name: string
  slug?: string
  address: Address
  phoneNumber?: string
  email?: string
  website?: string
  photoUrl?: string
  type: string
  services: string[]
  comments: string[]
  hours: Hours[]
  openingHours?: string
  specialties?: string[]
  rating?: number
  reviewCount?: number
  priceRange?: string
  googleMapsUrl?: string
  verified: boolean
  longitude?: number
  latitude?: number
  isFeatured?: boolean
  createdBy?: string
  createdAt?: string
  updatedAt?: string
}

export type LocationInput = {
  address?: string
  city?: string
  state?: string
  country?: string
  name?: string
}

export interface HospitalFormData {
  _id?: string
  name: string
  type: string
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
  }
  street: string
  city: string
  state: string
  phoneNumber: string
  email: string
  website: string
  photoUrl: string
  services: string
  comments: string[]
  hours: Hours[]
  longitude: string
  latitude: string
  isFeatured: boolean
  verified?: boolean
}

export type HospitalSubmission = Omit<
  Hospital,
  '_id' | 'slug' | 'longitude' | 'latitude'
>

export interface HospitalResponse {
  hospitals?: Hospital[]
  totalPages?: number
}

export interface NearbyHospital {
  _id: string
  name: string
  slug: string
  address?: {
    street?: string
    state?: string
    city?: string
  }
  type?: string
  distance?: string
  photoUrl?: string
  location?: { coordinates: number[] }
}

export interface SearchProps {
  searchParams: {
    address?: string
    city?: string
    state?: string
  }
}

export interface SearchState {
  hospitals: Hospital[]
  searching: boolean
  error: string
  searchMode: 'term' | 'nearby'
  locationName: string | null
  emptyResultQuery: string | null
  geocodedCenter: [number, number] | null
}

export interface UseHospitalDetailsProps {
  id?: string
  country?: string
  city?: string
  slug?: string
  name?: string
  accessToken?: string | null
  username?: string | null
}

export interface UseNearbyHospitalsProps {
  triggerLocation?: number
}

export interface UseNearbyCarouselProps {
  lat: number
  lon: number
  city?: string
}

export interface HospitalCardProps {
  hospital: Hospital
  userCoords?: { lat: number | null; lon: number | null } | null
}

export interface CountryCardProps {
  country: string
  count: number
}

export interface CountryData {
  country: string
  continent?: string
  hospitals: Hospital[]
}

export interface CountryListEntry {
  name: string
  continent: string
}

export interface CountrySummary {
  country: string
  totalHospitals: number
}

export interface RawSharedItem {
  hospitalId: string
  phoneNumber?: string
  phone?: string
  latitude?: number
  longitude?: number
  [key: string]: unknown
}
