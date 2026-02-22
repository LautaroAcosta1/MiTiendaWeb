import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
    index: true
  }

}, { timestamps: true });

CategorySchema.index({ name: 1, store: 1 }, { unique: true });

export default mongoose.model("Category", CategorySchema);