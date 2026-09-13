import mongoose from "mongoose";

const educationCardSchema = new mongoose.Schema({
  meta: {
    dateIcon:    String,
    date:        String,
    commentIcon: String,
    comment:     String,
  },
  title:      String,
  titleLink:  String,
  authorIcon: String,
  authorName: String,
  authorSub:  String,
  readMore:   String,
  readMoreLink: String,
});

const certCardSchema = new mongoose.Schema({
  imgBase64:  String,   
  imgMime:    String,   
  meta: {
    dateIcon:    String,
    date:        String,
    commentIcon: String,
    comment:     String,
  },
  title:      String,
  titleLink:  String,
  authorIcon: String,
  authorName: String,
  authorSub:  String,
  readMore:   String,
  readMoreLink: String,
});

const educationSchema = new mongoose.Schema(
  {
    educationCards: [educationCardSchema],
    certCards:      [certCardSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Education", educationSchema);