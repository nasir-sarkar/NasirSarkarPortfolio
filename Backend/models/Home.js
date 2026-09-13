import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({
  name: String,
  role: String,
  role2: String,    
  tagline: String,

  label1: String,
  target_number1: Number,

  label2: String,
  target_number2: Number,

  label3: String,
  target_number3: Number,
});

const Home = mongoose.model("Home", homeSchema);

export default Home;