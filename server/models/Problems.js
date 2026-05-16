import mongoose from "mongoose";

// 1. Problem Schema (Hardcoded questions - same for all users)
const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },          // "Bit Manipulation"
  subCategory: { type: String },                       // "Bitwise OR operator"
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  link: { type: String, required: true },              // Practice link (LeetCode)
  tags: [String],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Problem = mongoose.model("Problem", ProblemSchema);

export default Problem;

