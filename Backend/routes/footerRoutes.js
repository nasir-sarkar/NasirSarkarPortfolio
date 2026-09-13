import express from "express";
import Footer from "../models/Footer.js";

const router = express.Router();



// GET ALL FOOTER DATA
router.get("/getFooter", async (req, res) => {
  try {
    const data = await Footer.findOne();
    res.json(data || { footerContactInfo: [], footerInfoLinks: [], footerQuickLinks: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// UPDATE ALL FOOTER DATA 
router.put("/updateFooter", async (req, res) => {
  try {
    const updated = await Footer.findOneAndUpdate(
      {},
      {
        footerContactInfo: req.body.footerContactInfo,
        footerInfoLinks:   req.body.footerInfoLinks,
        footerQuickLinks:  req.body.footerQuickLinks
      },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ADD SINGLE FOOTER CONTACT INFO
router.post("/addFooterContactInfo", async (req, res) => {
  try {
    const updated = await Footer.findOneAndUpdate(
      {},
      {
        $push: {
          footerContactInfo: req.body   
        }
      },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// DELETE FOOTER CONTACT INFO BY INDEX
router.delete("/deleteFooterContactInfo/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);

    const doc = await Footer.findOne();

    if (!doc) {
      return res.status(404).json({ message: "No footer data found" });
    }

    doc.footerContactInfo.splice(index, 1);

    await doc.save();

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ADD SINGLE INFO LINK
router.post("/addInfoLink", async (req, res) => {
  try {
    const updated = await Footer.findOneAndUpdate(
      {},
      {
        $push: {
          footerInfoLinks: req.body  
        }
      },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// DELETE INFO LINK
router.delete("/deleteInfoLink/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);

    const doc = await Footer.findOne();

    if (!doc) {
      return res.status(404).json({ message: "No footer data found" });
    }

    doc.footerInfoLinks.splice(index, 1);

    await doc.save();

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ADD SINGLE QUICK LINK
router.post("/addQuickLink", async (req, res) => {
  try {
    const updated = await Footer.findOneAndUpdate(
      {},
      {
        $push: {
          footerQuickLinks: req.body 
        }
      },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// DELETE QUICK LINK
router.delete("/deleteQuickLink/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);

    const doc = await Footer.findOne();

    if (!doc) {
      return res.status(404).json({ message: "No footer data found" });
    }

    doc.footerQuickLinks.splice(index, 1);

    await doc.save();

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;