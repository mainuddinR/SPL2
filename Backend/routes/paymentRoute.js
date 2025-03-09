import  express  from "express";
import { paymentRecord, stripeWebhook,} from "../controllers/Payment.js";

const paymentRouter = express.Router();

paymentRouter.get('/record',paymentRecord);
paymentRouter.post('/webhook', stripeWebhook); 

export default paymentRouter;