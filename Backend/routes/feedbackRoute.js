import  express  from "express";
import authMiddleware from "../middleware/auth.js"
import { feedbackSubmission, getFeedback } from "../controllers/feedback.js";

const feedbackRouter = express.Router();

feedbackRouter.post('/submit',authMiddleware,feedbackSubmission);
feedbackRouter.get('/gets',getFeedback);

export default feedbackRouter;