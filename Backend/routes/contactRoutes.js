import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();




// GET ALL CONTACT DATA
router.get("/getContact", async (req, res) => {
  try {
    const data = await Contact.findOne();
    res.json(data || { contactInfo: [], socialLinks: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// UPDATE ALL CONTACT DATA
router.put("/updateContact", async (req, res) => {
  try {
    const updated = await Contact.findOneAndUpdate(
      {},
      {
        contactInfo: req.body.contactInfo,
        socialLinks: req.body.socialLinks
      },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ADD SINGLE CONTACT INFO ITEM
router.post("/addContactInfo", async (req, res) => {
  try {
    const updated = await Contact.findOneAndUpdate(
      {},
      {
        $push: {
          contactInfo: req.body 
        }
      },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// DELETE CONTACT INFO ITEM BY INDEX
router.delete("/deleteContactInfo/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);

    const doc = await Contact.findOne();

    if (!doc) {
      return res.status(404).json({ message: "No contact info found" });
    }

    doc.contactInfo.splice(index, 1);

    await doc.save();

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// ADD SINGLE SOCIAL LINK
router.post("/addSocialLink", async (req, res) => {
  try {
    const updated = await Contact.findOneAndUpdate(
      {},
      {
        $push: {
          socialLinks: req.body 
        }
      },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// DELETE SOCIAL LINK BY INDEX
router.delete("/deleteSocialLink/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);

    const doc = await Contact.findOne();

    if (!doc) {
      return res.status(404).json({ message: "No social links found" });
    }

    doc.socialLinks.splice(index, 1);

    await doc.save();

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;