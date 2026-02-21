import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 40 },
  description: { type:String, maxlength: 100 },
  oldPrice: { type: Number, required: false },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  imageId: String,
  stock: Number,

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
