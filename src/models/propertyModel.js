import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  type: { type: String, required: true },
  street: { type: String, required: true },
  doorNumber: { type: String, required: true },
  parish: { type: String, required: true },
  city: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  videos: [{ type: String }],
  plans: [{ type: String }],
  mapLocation: { type: String, required: true },
  features: [{ type: String }],
  status: { type: Boolean, required: true },
});

export const Property = mongoose.model('Property', PropertySchema);