import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema({
  links: [
    {
      href: String,
      icon: String,
      label: String,
      order: Number,
    }
  ]
});

const SocialLink = mongoose.model("SocialLink", socialLinkSchema);

export default SocialLink;