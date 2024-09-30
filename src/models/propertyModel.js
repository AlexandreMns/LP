import mongoose from "mongoose";

export const type = {
  HOUSE: "house",
  APARTMENT: "apartment",
  LAND: "land",
};

const PropertySchema = new mongoose.Schema({
  type: { type: String, enum: Object.values(type), required: true }, // house, apartment, land
  street: { type: String, required: true },
  size: { type: Number, required: true },
  condition: { type: String, required: true },
  bedrooms: {
    type: Number,
    required: function () {
      return this.type === type.HOUSE || this.type === type.APARTMENT;
    },
  }, // House or Apartment
  bathrooms: {
    type: Number,
    required: function () {
      return this.type === type.HOUSE || this.type === type.APARTMENT;
    },
  }, // House or Apartment
  doorNumber: { type: String, required: true },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parish: { type: String, required: true },
  city: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  videos: [{ type: String }],
  plans: [{ type: String }],
  mapLocation: { type: String, required: true },
  features: {
    airConditioning: { type: Boolean, default: false },
    builtInCabinets: { type: Boolean, default: false },
    elevator: { type: Boolean, default: false },
    balcony: { type: Boolean, default: false },
    garden: { type: Boolean, default: false },
    pool: { type: Boolean, default: false },
  },
  customFeatures: [{ type: String }],
  status: { type: String, required: true }, //Boleano ou string ???
});

export const Property = mongoose.model("Property", PropertySchema);
