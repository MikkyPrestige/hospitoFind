import { Hospital, LocationInput } from "./types";

const BASE_URL = 'http://localhost:5000/api';

export async function getHospitals() {
  try {
    const hospitals = await fetch(`${BASE_URL}/hospitals`);
    return hospitals.json();
  } catch (error) {
    console.log(error);
  }
}


export async function searchHospitals(query: string) {
  try {
    const hospitals = await fetch(`${BASE_URL}/hospitals/search?${query}`);
    return hospitals.json();
  } catch (error) {
    console.log(error);
  }
}


// export async function searchHospitals(location: LocationInput) {
//   try {
//     let url = `${BASE_URL}/hospitals`;
//     if (location.city || location.state) {
//       const searchLocation = location.city || location.state;
//       url += `/search?location=${searchLocation}`;
//     }
//     const response = await fetch(url);
//     return response.json();
//   } catch (error) {
//     console.log(error);
//   }
// }

export async function addHospital(hospital: Hospital) {
  try {
    const response = await fetch(`${BASE_URL}/hospitals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hospital),
    });
    if (!response.ok) {
      throw new Error('Failed to add hospital');
    }
    return response.json();
  } catch (error) {
    console.log(error);
  }
}

// export async function updateHospital(id: number, hospital: Hospital) {
//   try {
//     const response = await fetch(`${BASE_URL}/hospitals/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(hospital),
//     });
//     return response.json();
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function deleteHospital(id: number) {
//   try {
//     const response = await fetch(`${BASE_URL}/hospitals/${id}`, {
//       method: 'DELETE',
//     });
//     return response.json();
//   } catch (error) {
//     console.log(error);
//   }
// }

export default {
  getHospitals,
  addHospital,
  // updateHospital,
  // deleteHospital,
};
