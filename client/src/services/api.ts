const BASE_URL = 'http://localhost:5000/api';

// type Address = {
//   street: string;
//   city: string;
//   state: string;
//   zip: string;
// };

// type Hours = {
//   day: string;
//   open: string;
//   close: string;
// };

// type Hospital = {
//   id: number;
//   name: string;
//   address: Address[];
//   phoneNumber: string;
//   email: string;
//   website: string;
//   hours: Hours[];
//   ratings: number;
// };

export async function getHospitals() {
  try {
    const hospitals = await fetch(`${BASE_URL}/hospitals`);
    return hospitals.json();
  } catch (error) {
    console.log(error);
  }
}

// export async function addHospital(hospital: Hospital) {
//   try {
//     const response = await fetch(`${BASE_URL}/hospitals`, {
//       method: 'POST',
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
  // addHospital,
  // updateHospital,
  // deleteHospital,
};
