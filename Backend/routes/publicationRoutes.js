import express  from "express";
import Publication from "../models/Publication.js";

const router = express.Router();



// GET PUBLICATIONS
router.get("/getPublications", async (req, res) => {
  try {
    const data = await Publication.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// UPDATE ALL PUBLICATION CARDS
router.put("/updatePublications", async (req, res) => {
  try {
    const updated = await Publication.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// ADD PUBLICATION CARD
router.post("/addPublicationCard", async (req, res) => {
  try {
    const updated = await Publication.findOneAndUpdate(
      {},
      { $push: { publicationCards: req.body } },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// DELETE PUBLICATION CARD
router.delete("/deletePublicationCard/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const doc = await Publication.findOne();
    if (!doc) return res.status(404).json({ message: "Not found" });
    doc.publicationCards.splice(index, 1);
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;