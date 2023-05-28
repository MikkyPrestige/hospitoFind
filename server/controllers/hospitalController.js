import Hospital from "../models/hospitals.js";

export const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const searchHospitals = async (req, res) => {
  try {
    const { city, state } = req.query;
    const query = {};
    if (city) query['address.city'] = { $regex: new RegExp(city, 'i') };
    if (state) query['address.state'] = { $regex: new RegExp(state, 'i') };

    const hospitals = await Hospital.find(query);
    res.json(hospitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};


// export const searchHospitals = async (req, res) => {
//   try {
//     const { location } = req.query;
//     const hospitals = await Hospital.find({
//       'address.city': { $regex: new RegExp(location, 'i') },
//     });
//     res.json(hospitals);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Server Error' });
//   }
// };

export const addHospital = async (req, res) => {
  const {
    name,
    address,
    phoneNumber,
    email,
    website,
    services,
    hours,
    ratings,
  } = req.body;

  try {
    const newHospital = new Hospital({
      name,
      address,
      phoneNumber,
      email,
      website,
      services,
      hours,
      ratings,
    });

    const hospital = await newHospital.save();

    res.json(hospital);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const updateHospital = async (req, res) => {
  const {
    name,
    address,
    phoneNumber,
    email,
    website,
    services,
    hours,
    ratings,
  } = req.body;
  // Build hospital object
  const hospitalFields = {};
  if (name) hospitalFields.name = name;
  if (address) hospitalFields.address = address;
  if (phoneNumber) hospitalFields.phoneNumber = phoneNumber;
  if (email) hospitalFields.email = email;
  if (website) hospitalFields.website = website;
  if (services) hospitalFields.services = services;
  if (hours) hospitalFields.hours = hours;
  if (ratings) hospitalFields.ratings = ratings;
  try {
    let hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ msg: "Hospital not found" });
    hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { $set: hospitalFields },
      { new: true }
    );
    res.json(hospital);
  } catch (err) {
    console.error(er.message);
    res.status(500).send("Server Error");
  }
};

export const deleteHospital = async (req, res) => {
  try {
    let hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    await Hospital.findByIdAndRemove(req.params.id);

    res.json({ message: "Hospital removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// export const getHospitalById = async (req, res) => {
//   try {
//     let hospital = await Hospital.findById(req.params.id);

//     if (!hospital) {
//       return res.status(404).json({ message: "Hospital not found" });
//     }

//     res.json(hospital);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// };

// export const getHospitalByName = async (req, res) => {
//   try {
//     let hospital = await Hospital.findOne({ name: req.params.name });

//     if (!hospital) {
//       return res.status(404).json({ message: "Hospital not found" });
//     }

//     res.json(hospital);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// };

// export const getHospitalByAddress = async (req, res) => {
//   try {
//     let hospital = await Hospital.findOne({ address: req.params.address });

//     if (!hospital) {
//       return res.status(404).json({ message: "Hospital not found" });
//     }

//     res.json(hospital);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// };
