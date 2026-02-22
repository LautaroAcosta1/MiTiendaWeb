import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    maxlength: 40,
    trim: true
  },

  description: { 
    type: String, 
    maxlength: 100 
  },

  oldPrice: { 
    type: Number,
    min: 0
  },

  price: { 
    type: Number, 
    required: true,
    min: 0
  },

  image: { 
    type: String, 
    required: true 
  },

  imageId: String,

  stock: { 
    type: Number,
    default: 0,
    min: 0
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  }

}, { timestamps: true });

ProductSchema.index({ store: 1 });
ProductSchema.index({ store: 1, category: 1 });
ProductSchema.index({ store: 1, name: 1 }, { unique: true });

export default mongoose.model("Product", ProductSchema);