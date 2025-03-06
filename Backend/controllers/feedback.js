import feedbackModel from "../models/feedbackModel.js";

const feedbackSubmission = async (req, res) => {
    try {
      const { orderId, rating, comments } = req.body;
      const feedback = new feedbackModel({ userId: req.body.userId, orderId, rating, comments });
      await feedback.save();
      res.status(201).json({ message: "Feedback submitted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error submitting feedback", error });
    }
  };
 
  const getFeedback = async (req, res) => {
    try {
      const feedbacks = await feedbackModel.find().populate("userId", "name email")
      res.json(feedbacks);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Error fetching feedback" });
    }
  };

  export {feedbackSubmission,getFeedback};