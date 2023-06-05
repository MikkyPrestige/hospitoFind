import mongoose from "mongoose";
// import Hospital from "../models/hospitals.js";
// import fs from "fs";
// import fetch from "node-fetch";
// import chokidar from "chokidar";

// Populate database with data from json
// const populateDatabase = async () => {
//   const jsonData = fs.readFileSync("data/hospitals.json", "utf8");
//   const hospitals = JSON.parse(jsonData);
//   console.log("Data read from the json file");

//   hospitals.forEach(async (hospitalData) => {
//     try {
//       const hospital = new Hospital(hospitalData);
//       await hospital.save();
//       console.log('Hospital saved:', hospital);
//     } catch (err) {
//       console.log('Error saving hospital:', err);
//     }
//   });
// Clear the existing hospitals collection in the database
//   await Hospital.deleteMany();

//   // Insert the hospitals data into the database
//   await Hospital.insertMany(hospitals);
//   console.log("Data populated into the database");
// } catch (err) {
//   console.error(err.message);
// }
// };

// Connect to the database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.VITE_dbURI, {
      // useUnifiedTopology: true,
      // useNewUrlParser: true,
    });
    // Populate the database with data from the json file
    // await populateDatabase();
  } catch (err) {
    console.error(err.message);
  }
};

export default connectDB;
// Check if two hospitals are the same
// const sameHospital = (hospital1, hospital2) => {
//   return hospital1.id === hospital2.id &&
//     hospital1.name === hospital2.name &&
//     hospital1.address === hospital2.address &&
//     hospital1.city === hospital2.city &&
//     hospital1.state === hospital2.state &&
//     hospital1.zip === hospital2.zip &&
//     // hospital1.latitude === hospital2.latitude &&
//     // hospital1.longitude === hospital2.longitude &&
//     hospital1.website === hospital2.website &&
//     hospital1.phone === hospital2.phone &&
//     hospital1.rating === hospital2.rating
// }

// Synchronize the database with the JSON file
// const syncDB = async () => {
//   try {
//     const data = fs.readFileSync("../data/hospitals.json", "utf8");
//     if (!data) {
//       console.log("Empty JSON file. No synchronization needed.");
//       return;
//     }
//     const hospitals = JSON.parse(data);

//     // Retrieve the current data from the database
//     const currentHospitals = await Hospital.find();

//     // Track the IDs of hospitals in the JSON file
//     const jsonHospitalIds = hospitals.map(hospital => hospital.id);

//     // Find hospitals to be inserted, updated, and deleted
//     const hospitalsToInsert = hospitals.filter(hospital => {
//       return !currentHospitals.some(currentHospital => currentHospital.id === hospital.id);
//     });

//     const hospitalsToUpdate = hospitals.filter(hospital => {
//       return currentHospitals.some(currentHospital => currentHospital.id === hospital.id);
//     });

//     const hospitalsToDelete = currentHospitals.filter(currentHospital => {
//       return !jsonHospitalIds.includes(currentHospital.id);
//     });

//     // Insert new hospitals
//     if (hospitalsToInsert.length > 0) {
//       await Hospital.insertMany(hospitalsToInsert);
//       console.log(`${hospitalsToInsert.length} hospitals inserted`);
//     }

//     // Update existing hospitals
//     if (hospitalsToUpdate.length > 0) {
//       for (const hospital of hospitalsToUpdate) {
//         await Hospital.findOneAndUpdate({ id: hospital.id }, hospital);
//       }
//       console.log(`${hospitalsToUpdate.length} hospitals updated`);
//     }

//     // Delete hospitals
//     if (hospitalsToDelete.length > 0) {
//       const deleteIds = hospitalsToDelete.map(hospital => hospital.id);
//       await Hospital.deleteMany({ id: { $in: deleteIds } });
//       console.log(`${hospitalsToDelete.length} hospitals deleted`);
//     }

//     console.log("Database synchronization complete.");
//   } catch (error) {
//     console.error("Error synchronizing database:", error);
//   }
// };

// const syncDB = async () => {
//   try {
//     const data = fs.readFileSync("./data/hospitals.json", "utf8");
//     if (!data) {
//       console.log("Empty JSON file. No synchronization needed.");
//       return;
//     }
//     const updatedHospitals = JSON.parse(data);
//     // Retrieve the current data from the database
//     const currentHospitals = await Hospital.find();
//     // Find hospitals to be inserted, updated, and deleted
//     const hospitalsToInsert = updatedHospitals.filter((hospital) => {
//       return !currentHospitals.some(
//         (currentHospital) => currentHospital.id === hospital.id
//       );
//     });

//     const hospitalsToUpdate = updatedHospitals.filter((hospital) => {
//       return currentHospitals.some(
//         (currentHospital) => currentHospital.id === hospital.id && !sameHospital(currentHospital, hospital))
//     });

//     const hospitalsToDelete = currentHospitals.filter((currentHospital) => {
//       return !updatedHospitals.some(
//         (hospital) => hospital.id === currentHospital.id
//       );
//     });

//     // Insert new hospitals
//     if (hospitalsToInsert.length > 0) {
//       await Hospital.insertMany(hospitalsToInsert);
//       console.log(`${hospitalsToInsert.length} hospitals inserted`);
//     }

//     // Update existing hospitals
//     if (hospitalsToUpdate.length > 0) {
//       for (const hospital of hospitalsToUpdate) {
//         await Hospital.updateOne({ id: hospital.id }, hospital);
//       }
//       console.log(`${hospitalsToUpdate.length} hospitals updated`);
//     }

// // Delete hospitals
// if (hospitalsToDelete.length > 0) {
//   for (const hospital of hospitalsToDelete) {
//     await Hospital.deleteOne({ id: hospital.id });
//   }
//   console.log(`${hospitalsToDelete.length} hospitals deleted`);
// }
//     if (hospitalsToDelete.length > 0) {
//       const idsToDelete = hospitalsToDelete.map(hospital => hospital.id);
//       await Hospital.deleteMany({ id: { $in: idsToDelete } });
//       console.log(`${hospitalsToDelete.length} hospitals deleted`);
//     }

//     console.log("Database synchronization complete.");
//   } catch (error) {
//     console.error("Error synchronizing database:", error);
//   }
// };

// Trigger the synchronization process whenever the JSON file changes
// const watchDB = () => {
//   const watcher = chokidar.watch("./data/hospitals.json", {
//     persistent: true,
//   });

//   watcher.on("change", () => {
//     console.log("JSON file changed, updating database...");
//     syncDB();
//   });
// }

// Connect to the database
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.VITE_dbURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     watchDB();
//     console.log("Database connected");
//     // syncDB();
//   } catch (err) {
//     console.error(err.message);
//   }
// }

// export default connectDB;