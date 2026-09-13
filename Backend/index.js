import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";


// Routes
import homeRoutes from "./routes/homeRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import servicesRoutes from "./routes/serviceRoutes.js";
import skillsRoutes from "./routes/skillsRoutes.js";
import contactRoutes from "./routes/contactRoutes.js"
import footerRoutes from "./routes/footerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import contactMessageRoutes from "./routes/contactMessageRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";


dotenv.config();

const app = express();



// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))



// API ROUTES
app.use("/api/home", homeRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/contact", contactRoutes)
app.use("/api/footer", footerRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/education", educationRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/messages", contactMessageRoutes);
app.use("/api/social-links", socialRoutes);




// ROOT TEST ROUTE
app.get("/", (req, res) => {
  res.send("Portfolio Backend is Running 🚀");
});



// MongoDB CONNECTION
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });