import express from "express";
import { getAllDeliveryMen, addDeliveryMan, findByUserEmail } from "../controllers/deliveryMan.js";

const deliveryManRouter = express.Router();

deliveryManRouter.get("/", getAllDeliveryMen); // Get all delivery men
deliveryManRouter.post("/add", addDeliveryMan); // Add a new delivery man
deliveryManRouter.post('/getUser',findByUserEmail);

export default deliveryManRouter
