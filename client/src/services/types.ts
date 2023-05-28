// types file
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Hours {
  day: string;
  open: string;
  close: string;
}

export interface Hospital {
  name: string;
  address: Address;
  phoneNumber: string;
  email: string;
  website: string;
  services: string[];
  hours: Hours[];
  ratings: number;
}

export type LocationInput = {
  city?: string;
  state?: string;
  zip?: string;
};

type City = {
  name: string;
  state: string;
};

export const cities: City[] = [
  { name: 'Asaba', state: 'Delta' },
  { name: 'Lagos', state: 'Lagos' },
  { name: 'Abuja', state: 'Abuja' },
  { name: 'Port Harcourt', state: 'Rivers' },
  { name: 'Kano', state: 'Kano' },
];

