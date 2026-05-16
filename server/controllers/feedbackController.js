import Feedback from "../models/Feedback.js";

// Create Feedback
export const createFeedback = async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();
        res.status(201).json({ success: true, data: feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Feedback for a specific Interview
export const getFeedbackByInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const feedback = await Feedback.find({ interviewId }).populate("userId", "username email");
        res.json({ success: true, data: feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Feedback for a specific User
export const getFeedbackByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const feedback = await Feedback.find({ userId }).populate("interviewId");
        res.json({ success: true, data: feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Feedback
export const updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, data: feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Feedback
export const deleteFeedback = async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Feedback deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
