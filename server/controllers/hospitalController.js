import Hospital from "../models/hospitalsModel.js";
import asyncHandler from "express-async-handler";

// @desc Get all hospitals
// @route GET /api/hospitals
// @access Public
const getHospitals = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find({}).lean();
  // If no hospitals
  if (!hospitals) {
    return res.status(400).json({ message: 'No Hospital found' })
  }
  return res.json(hospitals);
})

// @desc Get hospital by name
// @route GET /api/hospitals/:name
// @access Public
const getHospitalByName = asyncHandler(async (req, res) => {
  const { name } = req.params
  const hospital = await Hospital.findOne({ name }).lean()
  // If no hospital
  if (!hospital) {
    return res.status(400).json({ message: 'Hospital not found' })
  }
  return res.json(hospital);
})

// @desc Search for hospitals by cities or state
// @route GET /api/hospitals/search?city=city&state=state
// @access Public
const searchHospitals = asyncHandler(async (req, res) => {
  const { address, city, state } = req.query;
  const query = {};
  if (address) {
    query['$or'] = [
      { name: { $regex: new RegExp(address, 'i') } },
      { 'address.street': { $regex: new RegExp(address, 'i') } }
    ]
  };
  if (city) query['address.city'] = { $regex: new RegExp(city, 'i') };
  if (state) query['address.state'] = { $regex: new RegExp(state, 'i') };

  const hospitals = await Hospital.find(query);
  if (!hospitals) {
    return res.status(400).json({
      success: false,
      error: "No matching records"
    });
  }

  return res.json(hospitals);
})

// @desc add new hospital
// @route POST /api/hospitals
// @access Public
const addHospital = asyncHandler(async (req, res) => {
  const {
    name,
    address,
    phoneNumber,
    website,
    email,
    type,
    services,
    comments,
    hours
  } = new Hospital(req.body);
  // confirm data
  if (!name || !address.city || !address.state) {
    return res.status(400).json({ message: 'Name, City and State address fields are required' })
  }
  // check for duplicate hospital by name and address
  const duplicate = await Hospital.findOne({ name, address }).lean().exec();
  if (duplicate) {
    return res.status(400).json({ message: 'Hospital already exists' })
  }
  // create new hospital
  const hospital = await Hospital.create({
    name,
    address,
    phoneNumber,
    website,
    email,
    type,
    services,
    comments,
    hours
  });

  if (hospital) {
    return res.status(201).json({ message: 'New hospital created' })
  } else {
    return res.status(400).json({ message: 'Invalid hospital data' })
  }
})

// @desc update hospital
// @route PATCH /api/hospitals/:id
// @access Public
const updateHospital = asyncHandler(async (req, res) => {
  const {
    id,
    name,
    address,
    phoneNumber,
    website,
    email,
    type,
    services,
    comments,
    hours
  } = new Hospital(req.body);
  // confirm data
  if (!name || !address.city || !address.state) {
    res.status(400).json({ message: 'Name, City and State address fields are required' })
  }
  // Confirm Hospital exists to update
  const hospital = await Hospital.findById(id).exec()
  if (!hospital) {
    res.status(404).json({ message: 'Hospital not found' })
  }
  // check for duplicate hospital by name and address
  const duplicate = await Hospital.findOne({ name, 'address.city': address.city, 'address.state': address.state }).lean().exec();
  // Allow updating of the original Hospital
  if (duplicate && duplicate._id.toString() !== id) {
    res.status(400).json({ message: 'Hospital already exists' })
  }
  // update hospital
  // The hospital fees are highly subsidized without quality compromise
  hospital.name = name;
  hospital.address = address;
  hospital.phoneNumber = phoneNumber;
  hospital.website = website;
  hospital.email = email;
  hospital.type = type;
  hospital.services = services;
  hospital.comments = comments;
  hospital.hours = hours;

  const updatedHospital = await hospital.save()
  return res.json(`${updatedHospital.name} updated`)
})

// @desc delete hospital
// @route DELETE /api/hospitals/:id
// @access Public
const deleteHospital = asyncHandler(async (req, res) => {
  // const hospital = await Hospital.findById(req.params.id).exec()
  const { name } = req.body
  const hospital = await Hospital.findOne({ name }).exec()

  if (!hospital) {
    return res.status(404).json({ message: 'Hospital not found' })
  }
  const result = await hospital.deleteOne()
  res.json(`${result.name} hospital deleted`)
})

export {
  getHospitals,
  getHospitalByName,
  searchHospitals,
  addHospital,
  updateHospital,
  deleteHospital
}