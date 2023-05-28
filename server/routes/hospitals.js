import express from "express";
import {
  getHospitals,
  searchHospitals,
  // addHospital,
  // updateHospital,
  // deleteHospital,
} from "../controllers/hospitalController.js";
// import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// @route   GET api/hospitals
// @desc    Get all hospitals
// @access  Public
router.get("/", getHospitals);

// @route   POST api/hospitals/search
// @desc    Search hospitals
// @access  Public
router.get("/search", searchHospitals);

// router.use(authenticate);
// @route   POST api/hospitals
// @desc    Add new hospital
// @access  Public
// router.post("/add", addHospital);

// @route   PUT api/hospitals/:id
// @desc    Update hospital
// @access  Public
// router.put("/update/:id", updateHospital);

// @route   DELETE api/hospitals/:id
// @desc    Delete hospital
// @access  Public
// router.delete("/delete/:id", deleteHospital);

export default router;
