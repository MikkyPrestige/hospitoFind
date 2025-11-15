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
country: string;
}

export interface Hours {
  day: string;
  open: string;
}

export interface Hospital {
  _id: string;
  name: string;
  address: Address;
  phoneNumber: string;
  email: string;
  website: string;
  photoUrl: string;
  type: string;
  services: string[];
  comments: string[];
  hours: Hours[];
  longitude: number;
  latitude: number;
}

export type LocationInput = {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  name?: string;
};