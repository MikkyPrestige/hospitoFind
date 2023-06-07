import express from "express";
import { createObjectCsvWriter } from "csv-writer";
import Hospital from "../models/hospitals.js";
import asyncHandler from "express-async-handler";

const exportRouter = express.Router();

exportRouter.get("/", asyncHandler(async (req, res) => {
  const { city, state } = req.query;

  const query = {};
  if (city) query["address.city"] = { $regex: new RegExp(city, "i") };
  if (state) query["address.state"] = { $regex: new RegExp(state, "i") }

  const hospitals = await Hospital.find(query).lean();

  const exportHospital = hospitals.map(hospital => ({
    name: hospital.name,
    street: hospital.street,
    city: hospital.city,
    state: hospital.state,
    phone: hospital.phone,
    website: hospital.website,
    email: hospital.email,
    type: hospital.type,
    services: hospital.services,
    comments: hospital.comments,
    hours: hospital.hours
  }));

  const csvWriter = createObjectCsvWriter({
    path: "hospitals.csv",
    header: [
      { id: "name", title: "Name" },
      { id: "street", title: "Street" },
      { id: "city", title: "City" },
      { id: "state", title: "State" },
      { id: "phone", title: "Phone" },
      { id: "website", title: "Website" },
      { id: "email", title: "Email" },
      { id: "type", title: "Type" },
      { id: "services", title: "Services" },
      { id: "comments", title: "Comments" },
      { id: "hours", title: "Hours" }
    ]
  })

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="hospitals.csv"');

  csvWriter.writeRecords(exportHospital)
    .then(() => res.download("hospitals.csv"))
}))

export default exportRouter;