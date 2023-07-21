import Hospital from "../models/hospitalsModel.js";
import ShareableLink from "../models/shareModel.js";
import asyncHandler from "express-async-handler";
import ids from "short-id";
import { createObjectCsvWriter } from "csv-writer";

// @desc Get all hospitals
// @route GET /hospitals
// @access Public
const getHospitals = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find({}).lean();
  // If no hospitals
  if (!hospitals) {
    return res.status(400).json({ message: 'No Hospital found' })
  }
  return res.json(hospitals);
})

// @desc Get hospitals randomly
// @route GET /hospitals/random
// @access Public
const getRandomHospitals = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.aggregate([{ $sample: { size: 3 } }])
  // If no hospitals
  if (!hospitals) {
    return res.status(400).json({ message: 'No Hospital found' })
  }
  return res.json(hospitals);
})

// @desc Get hospital by name
// @route GET /hospitals/:name
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

// @desc Find hospitals by name or address
// @route GET /hospitals/find?address=address&name=name
// @access Public
const findHospitals = asyncHandler(async (req, res) => {
  const { street, cityState, name } = req.query;
  const query = {};
  if (street) query['address.street'] = { $regex: new RegExp(street, 'i') };
  if (cityState) {
    query['$or'] = [
      { 'address.city': { $regex: new RegExp(cityState, 'i') } },
      { 'address.state': { $regex: new RegExp(cityState, 'i') } }
    ]
  };
  if (name) query.name = { $regex: new RegExp(name, 'i') };
  const hospitals = await Hospital.find(query);
  if (hospitals === 0) {
    return res.status(400).json({
      success: false,
      error: "No matching records"
    });
  }

  return res.json(hospitals);
})

// @desc Search for hospitals by cities or state
// @route GET /hospitals/search?city=city&state=state
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
  if (hospitals === 0) {
    return res.status(400).json({
      success: false,
      error: "No matching records"
    });
  }

  return res.json(hospitals);
})

// @desc share hospitals
// @route POST /hospitals/share
// @access Public
const shareHospitals = asyncHandler(async (req, res) => {
  const { city, state, cityState, name } = req.body.searchParams;
  const query = {};
  if (city) query['address.city'] = { $regex: new RegExp(city, 'i') };
  if (state) query['address.state'] = { $regex: new RegExp(state, 'i') };
  if (cityState) {
    query['$or'] = [
      { 'address.city': { $regex: new RegExp(cityState, 'i') } },
      { 'address.state': { $regex: new RegExp(cityState, 'i') } }
    ]
  };
  if (name) query.name = { $regex: new RegExp(name, 'i') };

  const searchedHospitals = await Hospital.find(query).lean()
  // Generate a unique link identifier
  const linkId = ids.generate()

  const shareableLink = new ShareableLink({
    linkId,
    hospitals: searchedHospitals.map(hospital => ({
      name: hospital.name,
      address: {
        street: hospital.address.street,
        city: hospital.address.city,
        state: hospital.address.state
      },
      phone: hospital.phone,
      website: hospital.website,
      email: hospital.email,
      type: hospital.type,
      services: hospital.services,
      comments: hospital.comments,
      hours: hospital.hours,
    }))
  })

  await shareableLink.save()
  // Return the generated shareable link to the client
  return res.status(200).json({ shareableLink: linkId });
})

// @desc Retrieve the hospital list associated with a shareable link
// @route GET /hospitals/share/:linkId
// @access Public
const getSharedHospitals = asyncHandler(async (req, res) => {
  const { linkId } = req.params
  const link = await ShareableLink.findOne({ linkId })

  if (!link) {
    return res.status(404).json({ error: "Link not found" })
  }

  const hospitals = link.hospitals
  // Return the hospital list to the client
  return res.status(200).json(hospitals)
})

// @dec export hospital
// @route GET /hospitals/export
// @access Public
const exportHospitals = asyncHandler(async (req, res) => {
  const { city, state } = req.body.searchParams;

  const query = {};
  if (city) query["address.city"] = { $regex: new RegExp(city, "i") };
  if (state) query["address.state"] = { $regex: new RegExp(state, "i") }

  const hospitals = await Hospital.find(query).lean();

  if (!hospitals) {
    return res.status(400).json({
      success: false,
      error: "No matching records"
    });
  }

  const csvData = hospitals.map(hospital => ({
    name: hospital.name,
    'address.street': hospital.address.street,
    'address.city': hospital.address.city,
    'address.state': hospital.address.state,
    phone: hospital.phone,
    website: hospital.website,
    email: hospital.email,
    type: hospital.type,
    services: hospital.services.join(", "),
    comments: hospital.comments.join(", "),
    hours: hospital.hours.map(hour => `${hour.day}: ${hour.open}`).join(", "),
  }));

  const csvWriter = createObjectCsvWriter({
    path: 'hospitals.csv',
    header: [
      { id: 'name', title: 'Name' },
      { id: 'address.street', title: 'Street' },
      { id: 'address.city', title: 'City' },
      { id: 'address.state', title: 'State' },
      { id: 'phone', title: 'Phone' },
      { id: 'website', title: 'Website' },
      { id: 'email', title: 'Email' },
      { id: 'type', title: 'Type' },
      { id: 'services', title: 'Services' },
      { id: 'comments', title: 'Comments' },
      { id: 'hours', title: 'Hours' },
    ],
  });


  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="hospitals.csv"');

  csvWriter.writeRecords(csvData)
    .then(() => res.download("hospitals.csv"))
})

// @desc add new hospital
// @route POST /hospitals
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
// @route PATCH /hospitals/:id
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
// @route DELETE /hospitals/:id
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

export default {
  getHospitals,
  getRandomHospitals,
  getHospitalByName,
  findHospitals,
  searchHospitals,
  shareHospitals,
  getSharedHospitals,
  exportHospitals,
  addHospital,
  updateHospital,
  deleteHospital
}