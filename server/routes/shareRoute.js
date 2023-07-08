import express from "express";
import ids from "short-id";
import asyncHandler from "express-async-handler"
import Hospital from "../models/hospitalsModel.js";
import ShareableLink from "../models/shareModel.js";

const shareRouter = express()

shareRouter.post("/", asyncHandler(async (req, res) => {
  const { city, state } = req.body.searchParams;

  const query = {}
  if (city) query["address.city"] = { $regex: new RegExp(city, "i") }
  if (state) query["address.state"] = { $regex: new RegExp(state, "i") }
  const searchedHospitals = await Hospital.find(query).lean()
  // Generate a unique link identifier
  const linkId = ids.generate()

  const shareableLink = new ShareableLink({
    linkId,
    hospitals: searchedHospitals.map(hospital => ({
      name: hospital.name,
      'address.street': hospital.address.street,
      'address.city': hospital.address.city,
      'address.state': hospital.address.state,
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
  const shareableLinkUrl = `${linkId}`

  res.status(200).json({ shareableLink: shareableLinkUrl });
}))

// Retrieve the hospital list associated with a shareable link
shareRouter.get("/:linkId", asyncHandler(async (req, res) => {
  const { linkId } = req.params
  const link = await ShareableLink.findOne({ linkId }).populate("hospitals").lean()

  if (!link) {
    return res.status(404).json({ error: "Link not found" })
  }

  const hospitals = link.hospitals
  // Return the hospital list to the client
  return res.status(200).json({ hospitals })
}))

export default shareRouter;