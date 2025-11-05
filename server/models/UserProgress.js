// 2. UserProgress Schema (Individual user's checkbox state)
const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
  isSolved: { type: Boolean, default: false },         // Checkbox state only
  solvedAt: { type: Date },
}, { timestamps: true });

// Ensure one record per user-problem
UserProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });