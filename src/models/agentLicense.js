import mongoose from "mongoose";

const AgentLicenseSchema = new mongoose.Schema({
  licenseNumber: { type: String, required: true, unique: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  issuingEntity: { type: String, required: true },
  licenseStatus: {
    type: String,
    enum: ["active", "suspended", "revoked"],
    required: true,
  },
  holder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const AgentLicense = mongoose.model("AgentLicense", AgentLicenseSchema);

export { AgentLicense };
