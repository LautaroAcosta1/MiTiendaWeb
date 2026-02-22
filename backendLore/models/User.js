import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    default: "admin"
  },

  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true
  }
}, { timestamps: true });

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", UserSchema);