import  express  from "express";
import { paymentRecord, processPayment, stripeWebhook, verifyPayment } from "../controllers/Payment.js";

const paymentRouter = express.Router();

paymentRouter.get('/record',paymentRecord);
paymentRouter.post('/processPayment',processPayment);
paymentRouter.get('/verifyPayment/:paymentId',verifyPayment);
paymentRouter.post('/webhook', stripeWebhook); 

export default paymentRouter;