import express from 'express';
import { updateStatus,placeOrder, verifyOrder, userOrders, listOrders, assignDeliveryMan } from '../controllers/Order.js';
import authMiddleware from "../middleware/auth.js"

const orderRouter = express.Router();

//orderRouter.put('/assignDeliveryPersonnel/:orderId', assignDeliveryPersonnel);

orderRouter.post('/place',authMiddleware,placeOrder);
orderRouter.post('/verify',verifyOrder);
orderRouter.post('/userorders',authMiddleware,userOrders)
orderRouter.get('/listorder',listOrders);
orderRouter.post('/status', updateStatus);
orderRouter.post('/assignDeliveryMan',assignDeliveryMan);

export default orderRouter;