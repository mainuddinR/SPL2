import express from "express";
import { getAllDeliveryMen, addDeliveryMan, findByUserEmail, getAssignedOrders, updateDeliveryManStatus, getStatus } from "../controllers/deliveryMan.js";
import authMiddleware from "../middleware/auth.js"

const deliveryManRouter = express.Router();

deliveryManRouter.get("/", getAllDeliveryMen); // Get all delivery men
deliveryManRouter.post("/add", addDeliveryMan); // Add a new delivery man
deliveryManRouter.post('/getUser',findByUserEmail);
deliveryManRouter.get('/assignOrder',authMiddleware,getAssignedOrders);
deliveryManRouter.post('/updateStatus', authMiddleware,updateDeliveryManStatus);
deliveryManRouter.get('/status',authMiddleware,getStatus);

export default deliveryManRouter
