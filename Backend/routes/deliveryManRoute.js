import express from "express";
import { addDeliveryMan, findByUserEmail, getAssignedOrders, updateDeliveryManStatus, getStatus, getAllDeliveryMen } from "../controllers/deliveryMan.js";
import authMiddleware from "../middleware/auth.js"
import { get } from "mongoose";

const deliveryManRouter = express.Router();

deliveryManRouter.get('/get',getAllDeliveryMen);
deliveryManRouter.post("/add", addDeliveryMan); 
deliveryManRouter.post('/getUser',findByUserEmail);
deliveryManRouter.get('/assignOrder',authMiddleware,getAssignedOrders);
deliveryManRouter.post('/updateStatus', authMiddleware,updateDeliveryManStatus);
deliveryManRouter.get('/status',authMiddleware,getStatus);

export default deliveryManRouter
