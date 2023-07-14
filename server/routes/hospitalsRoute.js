import express from "express";
import {
  getHospitals,
  getRandomHospitals,
  getHospitalByName,
  findHospitals,
  searchHospitals,
  addHospital,
  updateHospital,
  deleteHospital
} from "../controllers/hospitalController.js";
import verify from "../middleware/verify.js";

const hospitalRouter = express.Router();

hospitalRouter.route("/")
  .get(getHospitals)
  .post(addHospital)
  .patch(verify, updateHospital)

hospitalRouter.route("/random")
  .get(getRandomHospitals)

hospitalRouter.route("/find")
  .get(findHospitals)

hospitalRouter.route("/search")
  .get(searchHospitals)

hospitalRouter.route("/:name")
  .get(getHospitalByName)

hospitalRouter.route("/")
  .delete(deleteHospital);

export default hospitalRouter;