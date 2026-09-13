import express from "express";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();



// GET ALL PROJECTS
router.get("/getPortfolio", async (req, res) => {
  try {
    const data = await Portfolio.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET SINGLE PROJECT
router.get("/getProject/:projectId", async (req, res) => {
  try {
    const doc = await Portfolio.findOne();
    if (!doc) return res.status(404).json({ message: "Portfolio not found" });

    const project = doc.projects.id(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ADD PROJECT
router.post("/addProject", async (req, res) => {
  try {
    const updated = await Portfolio.findOneAndUpdate(
      {},
      { $push: { projects: req.body } },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// UPDATE FULL PROJECTS ARRAY
router.put("/updatePortfolio", async (req, res) => {
  try {
    const updated = await Portfolio.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// UPDATE SINGLE PROJECT
router.put("/updateProject/:projectId", async (req, res) => {
  try {
    const doc = await Portfolio.findOne();
    if (!doc) return res.status(404).json({ message: "Portfolio not found" });

    const project = doc.projects.id(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Merge incoming fields into the subdocument
    Object.assign(project, req.body);
    await doc.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// DELETE PROJECT
router.delete("/deleteProject/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const doc = await Portfolio.findOne();
    if (!doc) return res.status(404).json({ message: "Not found" });
    doc.projects.splice(index, 1);
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;