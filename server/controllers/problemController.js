// controllers/problemController.js
import Problem from "../models/Problem.js";
import UserProgress from "../models/UserProgress.js";

// Get all problems with user's progress
export const getAllProblems = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user is attached by auth middleware
    
    // Get all problems sorted by category, subcategory, and order
    const problems = await Problem.find({ isActive: true })
      .sort({ category: 1, subCategory: 1, order: 1 })
      .lean();
    
    // Get user's progress for all problems
    const userProgress = await UserProgress.find({ userId }).lean();
    
    // Create a map for quick lookup: problemId -> progress
    const progressMap = new Map(
      userProgress.map(p => [p.problemId.toString(), p])
    );
    
    // Merge progress with problems
    const problemsWithProgress = problems.map(problem => {
      const progress = progressMap.get(problem._id.toString());
      return {
        ...problem,
        isSolved: progress?.isSolved || false,
        solvedAt: progress?.solvedAt || null
      };
    });
    
    // Group by category and subcategory
    const grouped = problemsWithProgress.reduce((acc, problem) => {
      const category = problem.category;
      const subCategory = problem.subCategory || "General";
      
      if (!acc[category]) {
        acc[category] = {};
      }
      if (!acc[category][subCategory]) {
        acc[category][subCategory] = [];
      }
      acc[category][subCategory].push(problem);
      
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: grouped
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch problems" 
    });
  }
};

// Get a single problem by ID with user progress
export const getProblemById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { problemId } = req.params;
    
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ 
        success: false, 
        message: "Problem not found" 
      });
    }
    
    const progress = await UserProgress.findOne({ userId, problemId });
    
    res.json({
      success: true,
      data: {
        ...problem.toObject(),
        isSolved: progress?.isSolved || false,
        solvedAt: progress?.solvedAt || null
      }
    });
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch problem" 
    });
  }
};

// Toggle solved status (checkbox)
export const toggleProblemStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { problemId } = req.params;
    
    // Verify problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ 
        success: false, 
        message: "Problem not found" 
      });
    }
    
    // Find existing progress
    let progress = await UserProgress.findOne({ userId, problemId });
    
    if (!progress) {
      // Create new progress record (mark as solved)
      progress = new UserProgress({
        userId,
        problemId,
        isSolved: true,
        solvedAt: new Date()
      });
    } else {
      // Toggle existing status
      progress.isSolved = !progress.isSolved;
      progress.solvedAt = progress.isSolved ? new Date() : null;
    }
    
    await progress.save();
    
    res.json({ 
      success: true, 
      data: {
        isSolved: progress.isSolved,
        solvedAt: progress.solvedAt
      }
    });
  } catch (error) {
    console.error("Error toggling problem status:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update problem status" 
    });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get total problems count
    const totalProblems = await Problem.countDocuments({ isActive: true });
    
    // Get user's solved count
    const solvedCount = await UserProgress.countDocuments({ 
      userId, 
      isSolved: true 
    });
    
    // Calculate percentage
    const percentage = totalProblems > 0 
      ? ((solvedCount / totalProblems) * 100).toFixed(1) 
      : 0;
    
    // Get category-wise stats (optional)
    const problems = await Problem.find({ isActive: true }).lean();
    const userProgress = await UserProgress.find({ userId, isSolved: true }).lean();
    
    const solvedProblemIds = new Set(
      userProgress.map(p => p.problemId.toString())
    );
    
    const categoryStats = problems.reduce((acc, problem) => {
      const category = problem.category;
      if (!acc[category]) {
        acc[category] = { total: 0, solved: 0 };
      }
      acc[category].total++;
      if (solvedProblemIds.has(problem._id.toString())) {
        acc[category].solved++;
      }
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: {
        total: totalProblems,
        solved: solvedCount,
        unsolved: totalProblems - solvedCount,
        percentage: parseFloat(percentage),
        categoryStats
      }
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch statistics" 
    });
  }
};

// Admin: Add new problem (for your initial setup)
export const addProblem = async (req, res) => {
  try {
    const problem = new Problem(req.body);
    await problem.save();
    
    res.status(201).json({ 
      success: true, 
      data: problem,
      message: "Problem added successfully" 
    });
  } catch (error) {
    console.error("Error adding problem:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add problem" 
    });
  }
};

// Admin: Bulk add problems (to populate database quickly)
export const bulkAddProblems = async (req, res) => {
  try {
    const { problems } = req.body; // Array of problem objects
    
    if (!Array.isArray(problems) || problems.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide an array of problems" 
      });
    }
    
    const insertedProblems = await Problem.insertMany(problems);
    
    res.status(201).json({ 
      success: true, 
      data: insertedProblems,
      message: `${insertedProblems.length} problems added successfully` 
    });
  } catch (error) {
    console.error("Error bulk adding problems:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add problems" 
    });
  }
};

// Admin: Update problem
export const updateProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    
    const problem = await Problem.findByIdAndUpdate(
      problemId,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!problem) {
      return res.status(404).json({ 
        success: false, 
        message: "Problem not found" 
      });
    }
    
    res.json({ 
      success: true, 
      data: problem,
      message: "Problem updated successfully" 
    });
  } catch (error) {
    console.error("Error updating problem:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update problem" 
    });
  }
};

// Admin: Delete problem
export const deleteProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    
    const problem = await Problem.findByIdAndDelete(problemId);
    
    if (!problem) {
      return res.status(404).json({ 
        success: false, 
        message: "Problem not found" 
      });
    }
    
    // Optionally delete all user progress for this problem
    await UserProgress.deleteMany({ problemId });
    
    res.json({ 
      success: true, 
      message: "Problem deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete problem" 
    });
  }
};