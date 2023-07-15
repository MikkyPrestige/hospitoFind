import express from "express";
import hospitalController from "../controllers/hospitalController.js";
import verify from "../middleware/verify.js";

const hospitalRouter = express.Router();

hospitalRouter.route("/")
  .get(hospitalController.getHospitals)
  .post(hospitalController.addHospital)
  .patch(verify, hospitalController.updateHospital)

hospitalRouter.route("/random")
  .get(hospitalController.getRandomHospitals)

hospitalRouter.route("/find")
  .get(hospitalController.findHospitals)

hospitalRouter.route("/search")
  .get(hospitalController.searchHospitals)

hospitalRouter.route("/share")
  .post(hospitalController.shareHospitals)

hospitalRouter.route("/export")
  .get(hospitalController.exportHospitals)

hospitalRouter.route("/share/:linkId")
  .get(hospitalController.getSharedHospitals)

hospitalRouter.route("/:name")
  .get(hospitalController.getHospitalByName)

hospitalRouter.route("/")
  .delete(hospitalController.deleteHospital);

export default hospitalRouter;