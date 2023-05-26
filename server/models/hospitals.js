import mongoose from "mongoose";

const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
  id: {
    type: Number,
  },
  properties: {
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
    timestamps: {
      type: Date,
      default: Date.now,
    },
  },
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
