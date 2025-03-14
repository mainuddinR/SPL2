import express from 'express';
import { updateStatus,placeOrder, verifyOrder, userOrders, listOrders, assignDeliveryMan, pastOrders } from '../controllers/Order.js';
import authMiddleware from "../middleware/auth.js"

const orderRouter = express.Router();

orderRouter.post('/place',authMiddleware,placeOrder);
orderRouter.post('/verify',verifyOrder);
orderRouter.post('/userorders',authMiddleware,userOrders)
orderRouter.get('/listorder',listOrders);
orderRouter.post('/status', updateStatus);
orderRouter.post('/assignDeliveryMan',assignDeliveryMan);
orderRouter.get('/past',authMiddleware,pastOrders);

export default orderRouter;