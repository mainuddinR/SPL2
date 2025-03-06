import  express  from "express";
import authMiddleware from "../middleware/auth.js"
import { feedbackSubmission } from "../controllers/feedback.js";

const feedbackRouter = express.Router();

feedbackRouter.post('/submit',authMiddleware,feedbackSubmission);

export default feedbackRouter;