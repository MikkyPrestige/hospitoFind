import mongoose, { Schema } from "mongoose";

const shareableLink = new Schema({
  linkId: {
    type: String,
    required: true
  },
  hospitals: {
    type: Array,
    required: true
  }
})

const ShareableLink = mongoose.model("ShareableLink", shareableLink)

export default ShareableLink;