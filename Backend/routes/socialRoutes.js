import express from "express";
import SocialLink from "../models/SocialLink.js";

const router = express.Router();



// GET SOCIAL LINKS
router.get("/", async (req, res) => {
  try {
    const doc = await SocialLink.findOne(); 

    if (!doc) {
      return res.json([]); 
    }

    res.json(doc.links);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch social links" });
  }
});



// CREATE / REPLACE LINKS
router.post("/", async (req, res) => {
  try {
    let doc = await SocialLink.findOne();

    if (!doc) {
      doc = new SocialLink({ links: req.body.links });
    } else {
      doc.links = req.body.links;
    }

    await doc.save();
    res.json(doc.links);

  } catch (err) {
    res.status(500).json({ error: "Failed to save social links" });
  }
});



// DELETE ONE LINK BY INDEX
router.delete("/:index", async (req, res) => {
  try {
    const doc = await SocialLink.findOne();

    if (!doc) return res.json([]);

    doc.links.splice(req.params.index, 1);

    await doc.save();

    res.json(doc.links);

  } catch (err) {
    res.status(500).json({ error: "Failed to delete link" });
  }
});

export default router;