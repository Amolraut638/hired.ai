/* import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },             // e.g. "Merge Sorted Array"
  category: { type: String, required: true },          // e.g. "Sorting" or "2 Pointers"
  subCategory: { type: String },                       // e.g. "Two Pointer on Arrays"
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  link: { type: String, required: true },              // link to the question (e.g. LeetCode or your practice page)
  status: { type: String, enum: ["Unsolved", "Solved"], default: "Unsolved" },
  tags: [String],                                      // optional: ["array", "sorting"]
}, { timestamps: true });

export default mongoose.model("Problem", ProblemSchema);
 */

// 1. Problem Schema (Hardcoded questions - same for all users)
const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },          // "Bit Manipulation"
  subCategory: { type: String },                       // "Bitwise OR operator"
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  link: { type: String, required: true },              // Practice link (LeetCode)
  tags: [String],
  order: { type: Number, default: 0 },
}, { timestamps: true });

// ❌ NO status field here!

