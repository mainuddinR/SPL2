import  express  from "express";
import { createPromocode, getPromoCode } from "../controllers/promocode.js";

const promocodeRouter = express.Router();

promocodeRouter.post('/create',createPromocode);
promocodeRouter.get('/',getPromoCode);

export default promocodeRouter;