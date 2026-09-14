import express  from "express";
import Experience from "../models/Experience.js";

const router = express.Router();



// GET EXPERIENCE
router.get("/getExperience", async (req, res) => {
  try {
    const data = await Experience.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// UPDATE ALL EXPERIENCE CARDS
router.put("/updateExperience", async (req, res) => {
  try {
    const updated = await Experience.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// ADD EXPERIENCE CARD
router.post("/addExperienceCard", async (req, res) => {
  try {
    const updated = await Experience.findOneAndUpdate(
      {},
      { $push: { experienceCards: req.body } },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// DELETE EXPERIENCE CARD
router.delete("/deleteExperienceCard/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const doc = await Experience.findOne();
    if (!doc) return res.status(404).json({ message: "Not found" });
    doc.experienceCards.splice(index, 1);
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;