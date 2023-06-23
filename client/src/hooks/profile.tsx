// import axios from "axios";
// import { useState, useEffect } from "react";
// // import { useAuthContext } from "@/contexts/userContext";
// import { User } from "@/services/userTypes";
// import { useParams } from "react-router-dom";

// const BASE_URL = "http://localhost:5000/user"

// const userProfile = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [profile, setProfile] = useState<User | null>(null);
//   // const { state } = useAuthContext();
//   // const { id } = useParams<{ id: string }>();
//   const { username } = useParams<{ username: string }>();

//   const getProfile = async () => {
//     setLoading(true);
//     setError("");
//     await axios.get(`${BASE_URL}`, username)
//       .then((response) => {
//         setProfile(response.data)
//         console.log(response.data)
//       })
//       .catch((error) => {
//         if (error.response) {
//           setError(error.response.data.message)
//         }
//         else if (error.request) {
//           setError("Server did not respond")
//         }
//         else {
//           setError(error.message)
//         }
//       })
//       .finally(() => {
//         setLoading(false)
//       })
//   }

//   useEffect(() => {
//     getProfile()
//   }, [])

//   // return { loading, error, profile }

//   if (!profile) {
//     return <div>Loading...</div>
//   }
//   return (
//     <div>
//       {loading
//         ? <div>Loading...</div>
//         : <div>
//           <h1>{profile.name}</h1>
//           <h2>{profile.username}</h2>
//           <h3>{profile.email}</h3>
//           {/* <img src={`${BASE_URL}/image/${profile._id}`} /> */}
//         </div>
//       }
//       {error && <div>{error}</div>}
//     </div>
//   )
// }

// export default userProfile