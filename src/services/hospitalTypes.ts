// types file
export interface SearchProps {
  searchParams: {
    city?: string;
    state?: string;
    name?: string;
    cityState?: string;
  }
}
export interface Address {
  street: string;
  city: string;
  state: string;
}

export interface Hours {
  day: string;
  open: string;
}

export interface Hospital {
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
}

export type FindInput = {
  street?: string;
  cityState?: string;
  name?: string;
}

export type LocationInput = {
  address?: string;
  city?: string;
  state?: string;
  name?: string;
};