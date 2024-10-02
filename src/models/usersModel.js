import mongoose from "mongoose";

const roles = {
  CLIENT: "client",
  AGENT: "agent",
  ADMIN: "admin",
};

const roleHierarchy = {
  [roles.CLIENT]: 1,
  [roles.AGENT]: 2,
  [roles.ADMIN]: 3,
};

const WishlistSchema = new mongoose.Schema({
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Properties" }],
});

const WishListItemSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  note: { type: String, default: "" },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, //User
  email: { type: String, required: true, unique: true }, //User
  password: { type: String, required: true }, //User
  role: {
    type: String,
    enum: Object.values(roles),
    required: true,
    default: roles.CLIENT,
  }, //User
  resetPasswordToken: { type: String }, //User
  phone: { type: String }, //User ?
  agentLicense: { type: String }, //Agent
  employer: { type: String },
  wishList: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wishlist",
    required: true,
  }, //Client
});

const User = mongoose.model("User", UserSchema);
const Wishlist = mongoose.model("Wishlist", WishlistSchema);

export { User, roles, roleHierarchy, Wishlist };
