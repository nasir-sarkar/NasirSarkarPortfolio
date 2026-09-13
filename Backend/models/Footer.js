import mongoose from "mongoose";

const footerContactInfoSchema = new mongoose.Schema({
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
    default: null
  }
});

const footerLinkSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  },
  external: {
    type: Boolean,
    default: false
  }
});

const footerSchema = new mongoose.Schema({
  footerContactInfo: [footerContactInfoSchema],
  footerInfoLinks:   [footerLinkSchema],
  footerQuickLinks:  [footerLinkSchema]
});

export default mongoose.model("Footer", footerSchema);