import  express  from "express";
import { getUserProfile, loginUser,registerUser, updatePassword, updateUserProfile,getUserList } from "../controllers/userController.js";
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/userlist",getUserList);

userRouter.get("/profile",authMiddleware,getUserProfile);
userRouter.post("/profile_update",authMiddleware,updateUserProfile);

export default userRouter;