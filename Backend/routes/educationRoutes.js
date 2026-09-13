import express  from "express";
import Education from "../models/Education.js";

const router = express.Router();



// GET EDUCATION
router.get("/getEducation", async (req, res) => {
  try {
    const data = await Education.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// UPDATE ALL EDUCATION CARDS
router.put("/updateEducation", async (req, res) => {
  try {
    const updated = await Education.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// ADD EDUCATION CARD
router.post("/addEducationCard", async (req, res) => {
  try {
    const updated = await Education.findOneAndUpdate(
      {},
      { $push: { educationCards: req.body } },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// DELETE EDUCATION CARD
router.delete("/deleteEducationCard/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const doc = await Education.findOne();
    if (!doc) return res.status(404).json({ message: "Not found" });
    doc.educationCards.splice(index, 1);
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ADD CERT CARD
router.post("/addCertCard", async (req, res) => {
  try {
    const updated = await Education.findOneAndUpdate(
      {},
      { $push: { certCards: req.body } },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// DELETE CERT CARD
router.delete("/deleteCertCard/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const doc = await Education.findOne();
    if (!doc) return res.status(404).json({ message: "Not found" });
    doc.certCards.splice(index, 1);
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;