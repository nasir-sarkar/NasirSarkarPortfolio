import express from "express";
import Home from "../models/Home.js";
const router = express.Router();



// GET HOME
router.get("/getHome", async (req, res) => {
  try {
    const data = await Home.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// UPDATE HOME
router.put("/updateHome", async (req, res) => {
  try {
    const data = await Home.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true } 
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;