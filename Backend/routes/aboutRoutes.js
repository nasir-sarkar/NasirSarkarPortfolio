import express from "express";
import About from "../models/About.js";

const router = express.Router();



// GET ABOUT
router.get("/getAbout", async (req, res) => {
  try {
    const data = await About.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// UPDATE ABOUT
router.put("/updateAbout", async (req, res) => {
  try {
    const updated = await About.findOneAndUpdate(
      {}, 
      { $set: req.body },
      { new: true, upsert: true } 
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;