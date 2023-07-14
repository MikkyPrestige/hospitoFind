import mongoose from "mongoose";

const Schema = mongoose.Schema;

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