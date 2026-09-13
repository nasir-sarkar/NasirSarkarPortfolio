import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  row: {
    type: Number,
    default: 1
  }
});

const skillsSchema = new mongoose.Schema({
  skills: [skillSchema]
});

export default mongoose.model("Skills", skillsSchema);