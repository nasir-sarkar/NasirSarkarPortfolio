import express from "express";
import Admin from "../models/Admin.js";

const router = express.Router();



// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ "users.email": email });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const user = admin.users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});




// GET ALL USERS
router.get("/users", async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: "No admin found" });
    res.json(admin.users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// ADD NEW USER
router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: "No admin document found" });

    admin.users.push({ name, email, password });
    await admin.save();

    res.status(201).json({ message: "User added", users: admin.users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// UPDATE USER BY ID
router.put("/users/:id", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: "No admin document found" });

    const user = admin.users.id(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await admin.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// DELETE USER BY ID
router.delete("/users/:id", async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: "No admin document found" });

    const user = admin.users.id(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.deleteOne();
    await admin.save();

    res.json({ message: "User deleted", users: admin.users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;