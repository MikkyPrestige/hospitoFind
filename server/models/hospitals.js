import mongoose from "mongoose";

const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: Object,
    required: true,

    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
    },
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  services: {
    type: [String],
  },
  hours: {
    type: Object,
    required: true,

    monday: {
      type: String,
      required: true,
    },
    tuesday: {
      type: String,
      required: true,
    },
    wednesday: {
      type: String,
      required: true,
    },
    thursday: {
      type: String,
      required: true,
    },
    friday: {
      type: String,
      required: true,
    },
    saturday: {
      type: String,
      required: true,
    },
    sunday: {
      type: String,
      required: true,
    },
  },
  ratings: {
    type: Number,
  },
  timestamps: {
    type: Date,
    default: Date.now,
  },
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
