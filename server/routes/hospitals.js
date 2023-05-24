import express from "express";
import Hospital from "../models/hospitals.js";

const router = express.Router();

// @route   GET api/hospitals
// @desc    Get all hospitals
// @access  Public
router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/hospitals
// @desc    Add new hospital
// @access  Public
router.post("/", async (req, res) => {
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
});

// @route   PUT api/hospitals/:id
// @desc    Update hospital
// @access  Public
router.put("/:id", async (req, res) => {
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
});

// @route   DELETE api/hospitals/:id
// @desc    Delete hospital
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    let hospital = await Hospital.findById(req.params.id);

    if (!hospital) return res.status(404).json({ msg: "Hospital not found" });

    await Hospital.findByIdAndRemove(req.params.id);

    res.json({ msg: "Hospital removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/hospitals/:id
// @desc    Get hospital
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    let hospital = await Hospital.findById(req.params.id);

    if (!hospital) return res.status(404).json({ msg: "Hospital not found" });

    res.json(hospital);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
