import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  position: String,
  companyName: String,
  jobDescription: String,
  interviewType: String,
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  duration: String,
  questions: [
    {
      questionText: String,
      userAnswer: String,
      aiFeedback: String,
      score: Number
    }
  ],
  interviewerName: String,
  scheduledAt: Date,
  feedback: String,
  rating: Number,
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
}, { timestamps: true });

const Interview = mongoose.model("Interview", InterviewSchema);
export default Interview;
