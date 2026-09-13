import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    sectionTitle: String,
    eyebrow: String,
    subtitle: String,

    services: [
      {
        icon: String,     // ✅ added
        title: String,
        desc: String,     // ✅ FIXED (not description)
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Services", serviceSchema);