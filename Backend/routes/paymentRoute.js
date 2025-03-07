import  express  from "express";
import { processPayment, verifyPayment } from "../controllers/Payment.js";

const paymentRouter = express.Router();

paymentRouter.post('/processPayment',processPayment);
paymentRouter.get('/verifyPayment/:paymentId',verifyPayment);

export default paymentRouter;