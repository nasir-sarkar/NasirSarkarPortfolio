import mongoose from "mongoose";

const publicationCardSchema = new mongoose.Schema({
  title:       String,
  publisher:   String,
  year:        String,
  url:         String,
  description: String,
});

const publicationSchema = new mongoose.Schema(
  {
    publicationCards: [publicationCardSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Publication", publicationSchema);