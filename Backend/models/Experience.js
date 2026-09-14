import mongoose from "mongoose";

const experienceCardSchema = new mongoose.Schema({
  logoBase64:     String,
  logoMime:       String,
  position:       String,
  companyName:    String,
  companyLink:    String,
  employmentType: String,
  location:       String,
  locationType:   String,
  date:           String,
  skills:         [String],
});

const experienceSchema = new mongoose.Schema(
  {
    experienceCards: [experienceCardSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);