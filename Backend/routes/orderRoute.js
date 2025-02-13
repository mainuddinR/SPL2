import express from 'express';
import { updateStatus, assignDeliveryPersonnel } from '../controllers/Order.js';

const orderRouter = express.Router();

orderRouter.put('/updateStatus/:orderId', updateStatus);
orderRouter.put('/assignDeliveryPersonnel/:orderId', assignDeliveryPersonnel);

export default orderRouter;