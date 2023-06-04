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

router.get("/", getHospitals);

router.get("/search", searchHospitals);

// router.post("/add", addHospital);

// router.put("/update/:id", updateHospital);

// router.delete("/delete/:id", deleteHospital);

export default router;
