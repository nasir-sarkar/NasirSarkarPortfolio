import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  val: {
    type: String,
    required: true
  },
  href: {
    type: String,
    default: "#"
  }
});

const socialLinkSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
});

const contactSchema = new mongoose.Schema({
  contactInfo: [contactInfoSchema],
  socialLinks: [socialLinkSchema]
});

export default mongoose.model("Contact", contactSchema);