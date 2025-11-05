import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  interviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Interview", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  overallRating: { type: Number, min: 1, max: 5 },
  strengths: [String],
  improvements: [String],
  aiSummary: String,
}, { timestamps: true });

const Feedback = mongoose.model("Feedback", FeedbackSchema);

export default Feedback;
