import mongoose from "mongoose";

const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
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
  website: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  services: {
    type: [String],
  },
  hours: {
    type: [
      {
        day: {
          type: String,
          required: true,
        },
        open: {
          type: String,
          required: true,
        },
        close: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
  ratings: {
    type: Number,
  },
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
