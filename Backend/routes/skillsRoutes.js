import express from "express";
import Skills from "../models/Skills.js";

const router = express.Router();


// GET ALL SKILLS
router.get("/getSkills", async (req, res) => {
  try {
    const data = await Skills.findOne();
    res.json(data || { skills: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ADD SINGLE SKILL
router.post("/addSkill", async (req, res) => {
  try {
    const updated = await Skills.findOneAndUpdate(
      {},
      {
        $push: {
          skills: req.body   // { name, row }
        }
      },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// UPDATE ALL SKILLS
router.put("/updateSkills", async (req, res) => {
  try {
    const updated = await Skills.findOneAndUpdate(
      {},
      { skills: req.body.skills },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// DELETE SKILL
router.delete("/deleteSkill/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);

    const doc = await Skills.findOne();

    if (!doc) {
      return res.status(404).json({ message: "No skills found" });
    }

    doc.skills.splice(index, 1);

    await doc.save();

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;