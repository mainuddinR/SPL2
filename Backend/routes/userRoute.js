import  express  from "express";
import { getUserProfile, loginUser,registerUser, updatePassword, updateUserProfile,getUserList, sendOtp, verifyOtp, sendOtpForRegister } from "../controllers/user.js";
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router()

userRouter.post('/sendOtpForRegister',sendOtpForRegister);
userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/userlist",getUserList);

userRouter.get("/profile",authMiddleware,getUserProfile);
userRouter.post("/profile_update",authMiddleware,updateUserProfile);
userRouter.post("/password_change",authMiddleware,updatePassword);

userRouter.post("/forgot-password", sendOtp);
userRouter.post("/verify-otp", verifyOtp);

export default userRouter;