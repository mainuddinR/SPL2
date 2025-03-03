import express from 'express';
import { updateStatus, assignDeliveryPersonnel,placeOrder, verifyOrder, userOrders } from '../controllers/Order.js';
import authMiddleware from "../middleware/auth.js"

const orderRouter = express.Router();

orderRouter.put('/updateStatus/:orderId', updateStatus);
orderRouter.put('/assignDeliveryPersonnel/:orderId', assignDeliveryPersonnel);

orderRouter.post('/place',authMiddleware,placeOrder);
orderRouter.post('/verify',verifyOrder);
orderRouter.post('/userorders',authMiddleware,userOrders)

export default orderRouter;