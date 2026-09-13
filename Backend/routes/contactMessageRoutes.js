import express from "express";
import ContactMessage from "../models/ContactMessage.js";

const router = express.Router();



// SEND MESSAGE
router.post("/sendMessage", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Name, email and message are required." });
    }
    const newMsg = new ContactMessage({ name, email, phone, subject, message });
    await newMsg.save();
    res.json({ success: true, message: "Message saved successfully." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});




// GET ALL MESSAGES
router.get("/getMessages", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// DELETE MESSAGE BY ID
router.delete("/deleteMessage/:id", async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// DELETE ALL MESSAGES
router.delete("/deleteAllMessages", async (req, res) => {
  try {
    await ContactMessage.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;