import express from "express";
import {
  getHospitals,
  searchHospitals,
  addHospital,
  updateHospital,
  deleteHospital
} from "../controllers/hospitalController.js";
import verify from "../middleware/verify.js";
// import checkJwt from "../middleware/auth0.js";

const hospitalRouter = express.Router();

hospitalRouter.route("/")
  .get(verify, getHospitals)
  .post(verify, addHospital)
  .patch(verify, updateHospital)

hospitalRouter.route("/search")
  .get(searchHospitals)

hospitalRouter.route("/:id")
  .delete(verify, deleteHospital);

export default hospitalRouter;