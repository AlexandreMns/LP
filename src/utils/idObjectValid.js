import mongoose from "mongoose";

export default function objectValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}