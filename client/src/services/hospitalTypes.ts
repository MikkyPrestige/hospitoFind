// types file
export interface SearchProps {
  searchParams: {
    city?: string;
    state?: string;
    address?: string;
    name?: string;
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
};

type StatesAndCities = {
  city: string;
  state: string;
};

export const statesAndCities: StatesAndCities[] = [
  { city: 'Abakaliki', state: 'Ebonyi' },
  { city: 'Abeokuta', state: 'Ogun' },
  { city: 'Abuja', state: 'FCT' },
  { city: 'Ado-Ekiti', state: 'Ekiti' },
  { city: 'Akure', state: 'Ondo' },
  { city: 'Asaba', state: 'Delta' },
  { city: 'Awka', state: 'Anambra' },
  { city: 'Bauchi', state: 'Bauchi' },
  { city: 'Benin City', state: 'Edo' },
  { city: 'Birnin Kebbi', state: 'Kebbi' },
  { city: 'Calabar', state: 'Cross River' },
  { city: 'Damaturu', state: 'Yobe' },
  { city: 'Dutse', state: 'Jigawa' },
  { city: 'Ekiti', state: 'Ado' },
  { city: 'Enugu', state: 'Enugu' },
  { city: 'Gombe', state: 'Gombe' },
  { city: 'Gusau', state: 'Zamfara' },
  { city: 'Ibadan', state: 'Oyo' },
  { city: 'Ikeja', state: 'Lagos' },
  { city: 'Ilorin', state: 'Kwara' },
  { city: 'Jalingo', state: 'Taraba' },
  { city: 'Jos', state: 'Plateau' },
  { city: 'Kaduna', state: 'Kaduna' },
  { city: 'Kano', state: 'Kano' },
  { city: 'Katsina', state: 'Katsina' },
  { city: 'Lafia', state: 'Nasarawa' },
  { city: 'Lokoja', state: 'Kogi' },
  { city: 'Maiduguri', state: 'Borno' },
  { city: 'Makurdi', state: 'Benue' },
  { city: 'Minna', state: 'Niger' },
  { city: 'Owerri', state: 'Imo' },
  { city: 'Portharcourt', state: 'Rivers' },
  { city: 'Sokoto', state: 'Sokoto' },
  { city: 'Umuahia', state: 'Abia' },
  { city: 'Uyo', state: 'Akwa Ibom' },
  { city: 'Yenagoa', state: 'Bayelsa' },
  { city: 'Yola', state: 'Adamawa' },
];

