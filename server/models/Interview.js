const InterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  position: { type: String, required: true },
  companyName: { type: String },
  jobDescription: { type: String },
  interviewType: { type: String, default: "Technical" },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  duration: { type: String, default: "30 min" },
  questions: [
    {
      questionText: { type: String, required: true },
      userAnswer: { type: String },
      aiFeedback: { type: String },
      score: { type: Number, min: 0, max: 10 },
    },
  ],
  interviewerName: { type: String, default: "AI Interviewer" },
  scheduledAt: { type: Date },
  feedback: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  status: {
    type: String,
    enum: ["scheduled", "in-progress", "completed", "cancelled"],
    default: "scheduled",
  },
}, { timestamps: true });
