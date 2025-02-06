import  express  from "express";
import { getUserProfile, loginUser,registerUser, updatePassword, updateUserProfile } from "../controllers/userController.js";


const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/profile",getUserProfile);
userRouter.post("/profile",updateUserProfile,updatePassword);

export default userRouter;