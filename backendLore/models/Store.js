import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  whatsappNumber: {
    type: String,
    required: true
  },

  whatsappMessage: {
    type: String,
    default: "Hola! Quiero consultar por los siguientes productos:"
  },
}, { timestamps: true });

export default mongoose.model("Store", storeSchema);