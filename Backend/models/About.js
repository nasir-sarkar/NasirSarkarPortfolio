import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    sectionTitle: String,
    firstHighlightedText: String,
    secondHighlightedText: String,
    objective: String,
    cvLink: String,
    experienceYears: String,

    info: {
      l1: { label: String, value: String },
      l2: { label: String, value: String },
      l3: { label: String, value: String },
      l4: { label: String, value: String },
      l5: { label: String, value: String },
      l6: { label: String, value: String },
      l7: { label: String, value: String },
      l8: { label: String, value: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("About", aboutSchema);