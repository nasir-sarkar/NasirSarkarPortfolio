import mongoose from "mongoose";

const portfolioProjectSchema = new mongoose.Schema({
  // existing fields
  imgBase64: String,
  imgMime:   String,
  cat:       String,
  title:     String,
  tech:      String,
  link:      String,
  gradient:  String,


  // NEW detail-page fields
  detailTitle:       String,          
  description:       String,        
  detailImage1Base64: String,         
  detailImage1Mime:   String,
  detailImage2Base64: String,         
  detailImage2Mime:   String,
  features:          [String],        
  liveLink:          String,         
});


const portfolioSchema = new mongoose.Schema(
  {
    projects: [portfolioProjectSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", portfolioSchema, "blogs");