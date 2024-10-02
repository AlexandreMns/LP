import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
  saleDate: { type: Date, default: Date.now, required: true },
  saleValue: { type: Number, required: true },
});

const Sale = mongoose.model("Sale", SaleSchema);

export default Sale;
