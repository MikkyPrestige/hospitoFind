import express from "express";
import {
  getHospitals,
  searchHospitals,
  addHospital,
  updateHospital,
  deleteHospital
} from "../controllers/hospitalController.js";

const hospitalRouter = express.Router();

hospitalRouter.route("/")
  .get(getHospitals)
  .post(addHospital)
  .patch(updateHospital)

hospitalRouter.route("/search")
  .get(searchHospitals)

hospitalRouter.route("/:id")
  .delete(deleteHospital);

export default hospitalRouter;