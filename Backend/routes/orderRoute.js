import express from 'express';
import { updateStatus, assignDeliveryPersonnel,placeOrder, verifyOrder } from '../controllers/Order.js';
import authMiddleware from "../middleware/auth.js"

const orderRouter = express.Router();

orderRouter.put('/updateStatus/:orderId', updateStatus);
orderRouter.put('/assignDeliveryPersonnel/:orderId', assignDeliveryPersonnel);

orderRouter.post('/place',authMiddleware,placeOrder);
orderRouter.post('/verify',verifyOrder);

export default orderRouter;