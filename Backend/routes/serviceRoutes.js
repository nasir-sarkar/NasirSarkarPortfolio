import express from "express";
import Services from "../models/Services.js";

const router = express.Router();



// GET SERVICES
router.get("/getServices", async (req, res) => {
  try {
    const data = await Services.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ADD SINGLE SERVICE
router.post("/addService", async (req, res) => {
  try {
    const { icon, title, desc } = req.body;

    if (!title || !desc) {
      return res.status(400).json({ error: "Title and desc are required" });
    }

    const updated = await Services.findOneAndUpdate(
      {},
      { $push: { services: { icon, title, desc } } },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// UPDATE ALL SERVICES
router.put("/updateServices", async (req, res) => {
  try {
    const { services } = req.body;

    const updated = await Services.findOneAndUpdate(
      {},
      { $set: { services } },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// DELETE SERVICE
router.delete("/deleteService/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const doc = await Services.findOne();

    if (!doc) return res.status(404).json({ message: "No services found" });

    doc.services.splice(index, 1);
    await doc.save();

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;