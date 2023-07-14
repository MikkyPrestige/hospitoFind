import express from "express";
import { createObjectCsvWriter } from "csv-writer";
import Hospital from "../models/hospitalsModel.js";
import asyncHandler from "express-async-handler";

const exportRouter = express.Router();

exportRouter.get("/", asyncHandler(async (req, res) => {
  const { city, state } = req.body.searchParams;

  const query = {};
  if (city) query["address.city"] = { $regex: new RegExp(city, "i") };
  if (state) query["address.state"] = { $regex: new RegExp(state, "i") }

  const hospitals = await Hospital.find(query).lean();

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
}))

export default exportRouter;