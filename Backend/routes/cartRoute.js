// import express from 'express'
// import { addToCart,removeFromCart,getCart } from '../controllers/cartController.js'
// import authMiddleware from '../middleware/auth.js';

// const cartRouter = express.Router();

// cartRouter.post("/add",authMiddleware, addToCart);
// cartRouter.post("/remove", authMiddleware, removeFromCart);
// cartRouter.post("/get",authMiddleware, getCart);

// export default cartRouter;

import  express  from "express";
//import cartController from './controllers/cartController.js'
import { addItemToCart, addToCartForReorder, getCart, removeItemFromCart, updateItemQuantity } from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js"

const cartRouter = express.Router();
//const cartController = require('./cartController');

// router.post('/add', cartController.addItem);
// router.post('/remove', cartController.removeItem);
// router.post('/update', cartController.updateQuantity);
// router.get('/:userId', cartController.getCart);

cartRouter.get("/:userId",getCart);
cartRouter.post("/add",addItemToCart);
cartRouter.post("/remove",removeItemFromCart);
cartRouter.post("/update",updateItemQuantity);
cartRouter.post("/reorder",authMiddleware,addToCartForReorder);


export default cartRouter;