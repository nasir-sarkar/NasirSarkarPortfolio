import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const adminSchema = new mongoose.Schema(
  { users: [userSchema] },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);