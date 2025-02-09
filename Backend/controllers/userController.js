import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator";


// //Generate JWT token
// const createToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
// };

//login user
const loginUser = async (req,res) => {
    const {email,password} = req.body;
    try{
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success:false,message:"User doesn't exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password);
        
        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"})
        }
        const token = createToken(user._id)
        res.json({success:true,token})

    }catch(error){
        console.log(error);
        res.json({success:false,message:"ERROR"})
    }
}

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register user
const registerUser = async (req,res) => {
    const {name,password,email} = req.body;
    try{
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false,message:"User already exists"})
        }
        //validating email format and strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }

        if(password.length<8){
            return res.json({success:false, message:"Please enter a strong password"})
        }
        
        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);


        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword 
        })

        const user = await newUser.save() //database save
        const token = createToken(user._id)
        res.json({success:true,token});

    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
      const user = await userModel.findById(req.body.id);
      res.json({success:true,data:user});
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  //get all user
  const getUserList =async (req,res)  =>{
      try{
        const users = await userModel.find({});
        res.json({success:true,data:users});
      }
      catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
      }
  }
  
  // Update User Profile
  const updateUserProfile = async (req, res) => {
    // console.log(req.body);
    // console.log(req.body.userId);
    try {
      // const updatedUser = await userModel.findByIdAndUpdate(req.body.userId, req.body, { new: true }).select('password');
      // console.log(updatedUser);

      //res.json(updatedUser);
      await userModel.updateOne(
        {_id:req.body.userId},{
          $set:{
            name:req.body.user.name,
            phone:req.body.user.phone,
            address:req.body.user.address
          }
        }
      )
      res.json({success:true,message:"update successfully"})
      }
     catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
  // Update Password
  const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
      const user = await userModel.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect current password" });
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
  export { loginUser, registerUser, getUserProfile, updateUserProfile, updatePassword ,getUserList};
  