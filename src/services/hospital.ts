export interface SearchProps {
  searchParams: {
    address?: string;
    city?: string;
    state?: string;
  }
}
export interface Address {
  street: string;
  city: string;
  state: string;
  country?: string;
}

export interface Hours {
  day: string;
  open: string;
}

export interface Hospital {
  _id: string;
  name: string;
  slug?: string;
  address: Address;
  phoneNumber?: string;
  email?: string;
  website?: string;
  photoUrl?: string;
  type: string;
  services: string[];
  comments: string[];
  hours: Hours[];
  verified: boolean;
  longitude?: number;
  latitude?: number;
 isFeatured?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LocationInput = {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  name?: string;
};

export interface HospitalFormData {
    _id?: string;
    name: string;
    type: string;
    street: string;
    city: string;
    state: string;
    phoneNumber: string;
    email: string;
    website: string;
    photoUrl: string;
    services: string;
    comments: string[];
    hours: Hours[];
    longitude: string;
    latitude: string;
    isFeatured: boolean;
    verified?: boolean;
}