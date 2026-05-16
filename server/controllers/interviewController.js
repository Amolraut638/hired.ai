import Interview from "../models/Interview.js";
import aiService from "../services/aiService.js";

// Create an interview. Body may include { position, difficulty, questions (optional), generate: true }
export const createInterview = async (req, res) => {
  try {
    const { position, difficulty, questions, generate, duration, companyName, jobDescription } = req.body;

    let generatedQuestions = [];
    let generatedByAI = true;
    let aiError = null;
    if (generate) {
      try {
        console.log('Creating interview — requesting AI questions for', { position, difficulty });
        
        // Calculate count based on duration (e.g., 2 min -> 2 questions, 5 min -> 5 questions)
        let count = 5;
        if (duration && duration.includes('min')) {
          const mins = parseInt(duration);
          if (!isNaN(mins)) count = mins;
        }
        
        const result = await aiService.generateQuestions({ position, difficulty, count, jobDescription, duration });
        console.log('aiService.generateQuestions returned', { usedAI: result?.usedAI, error: result?.error, count: Array.isArray(result?.questions) ? result.questions.length : null });
        if (result && Array.isArray(result.questions)) {
            // result.questions may be array of objects { question, suggestedAnswer } or strings
            generatedQuestions = result.questions.map((q) => {
              if (typeof q === 'string') return { question: q, suggestedAnswer: '' };
              return { question: q.question || q.questionText || q.q || '', suggestedAnswer: q.suggestedAnswer || q.suggested_answer || q.answer || '' };
            });
            generatedByAI = !!result.usedAI;
            aiError = result.error || null;
          } else if (Array.isArray(result)) {
            // backward compatibility in case service returned array of strings
            generatedQuestions = result.map((q) => (typeof q === 'string' ? { question: q, suggestedAnswer: '' } : { question: q.question || '', suggestedAnswer: q.suggestedAnswer || '' }));
          }
      } catch (err) {
        console.error('aiService.generateQuestions threw:', err);
        // fallback to simple templates if aiService unexpectedly throws
        const fallback = [];
        let count = 5;
        if (duration && duration.includes('min')) {
          const mins = parseInt(duration);
          if (!isNaN(mins)) count = mins;
        }
        for (let i = 0; i < count; i++) {
          fallback.push(`Question ${i + 1} about ${position || 'the role'}`);
        }
        generatedQuestions = fallback;
        generatedByAI = false;
        aiError = err.message || String(err);
      }
    }

    const qArr = (questions && questions.length)
      ? questions.map((q) => ({ questionText: q }))
      : generatedQuestions.map((q) => ({ questionText: (q.question || q), suggestedAnswer: q.suggestedAnswer || '' }));

    const interview = await Interview.create({
      userId: req.userId || req.body.userId,
      position,
      difficulty,
      duration: duration || "30 min",
      companyName,
      questions: qArr,
      generatedByAI,
      aiError,
      status: "scheduled",
    });

    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });
    res.json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit answers for an interview and run AI evaluation
export const submitAnswers = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // expected [{ index: 0, answer: "..." }, ...] or [{ questionText, userAnswer }, ...]

    const interview = await Interview.findById(id);
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });

    // attach answers
    if (Array.isArray(answers)) {
      // map by index when provided
      answers.forEach((a) => {
        if (typeof a.index === "number" && interview.questions[a.index]) {
          interview.questions[a.index].userAnswer = a.answer || a.userAnswer;
        } else if (a.questionText) {
          // try to match by questionText
          const q = interview.questions.find((qq) => qq.questionText === a.questionText);
          if (q) q.userAnswer = a.userAnswer || a.answer;
        }
      });
    }

    interview.status = "completed";
    await interview.save();

    // Evaluate with AI
    let evalResults = [];
    try {
      evalResults = await aiService.evaluateAnswers({ questions: interview.questions });

      // merge evaluation results into interview.questions
      interview.questions = interview.questions.map((q) => {
        const match = evalResults.find((e) => (e.question && e.question.trim() === q.questionText.trim()) );
        if (match) {
          return { 
            ...q.toObject(), 
            aiFeedback: match.feedback || match.explanation || "", 
            score: match.score || match.points || 0,
            suggestedAnswer: match.suggestedAnswer || match.idealAnswer || match.modelAnswer || q.suggestedAnswer || ''
          };
        }
        return { ...q.toObject(), aiFeedback: "No feedback", score: 0, suggestedAnswer: q.suggestedAnswer || '' };
      });

      // optional: compute average score
      const avg = interview.questions.reduce((s, q) => s + (q.score || 0), 0) / (interview.questions.length || 1);
      interview.rating = Math.round((avg / 2) * 10) / 10; // 0-5 scale
      
      // Generate a summary feedback if not provided by AI
      if (evalResults.length > 0) {
          interview.feedback = `Interview completed with an average score of ${(avg).toFixed(1)}/10.`;
      }
      
      await interview.save();
    } catch (evalErr) {
      console.error("AI Evaluation failed, but interview was saved:", evalErr);
    }

    res.json({ success: true, data: interview, aiEvaluation: evalResults });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listUserInterviews = async (req, res) => {
  try {
    const userId = req.userId || req.query.userId;
    const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findByIdAndDelete(id);
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }
    res.json({ success: true, message: "Interview deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
