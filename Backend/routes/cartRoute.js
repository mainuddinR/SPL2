import  express  from "express";
import { addItemToCart, addToCartForReorder, getCart, removeItemFromCart, updateItemQuantity } from "../controllers/cart.js";
import authMiddleware from "../middleware/auth.js"

const cartRouter = express.Router();
cartRouter.get("/:userId",getCart);
cartRouter.post("/add",addItemToCart);
cartRouter.post("/remove",removeItemFromCart);
cartRouter.post("/update",updateItemQuantity);
cartRouter.post("/reorder",authMiddleware,addToCartForReorder);


export default cartRouter;