import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator";
import axios from 'axios';
import nodemailer from "nodemailer";

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" })
    }
    const token = createToken(user._id)
    res.json({ success: true, token })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "ERROR" })
  }
}

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}

//register user

const otpStore = {};

const sendOtpForRegister = async (req, res) => {
  const { name, email, password, role,phone,address } = req.body;

  const exists = await userModel.findOne({ email });
  if (exists) return res.json({ success: false, message: "User already exists" });

  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Please enter a valid email" });
  }

  if (password.length < 8) {
    return res.json({ success: false, message: "Please enter a strong password" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = { otp, name, email, password, role,phone,address, expiresAt: Date.now() + 5 * 60 * 1000 };

  let transporter = nodemailer.createTransport({ service: "gmail", auth: { user: "mainuddin01718887159@gmail.com", pass: "dxxstvxdnzwvbqww" } });

  await transporter.sendMail({ to: email, subject: "Account Registration OTP", text: `Your OTP: ${otp}` });

  res.json({ success: true, message: "OTP sent successfully!" });
};

const registerUser = async (req, res) => {
  const { email, otp } = req.body;

  try {

    if (!otpStore[email]) return res.json({ success: false, message: "OTP expired or invalid!" });

    const { name, password, role,phone,address, expiresAt } = otpStore[email];

    if (Date.now() > expiresAt) {
      delete ootpStore[email];
      return res.json({ success: false, message: "OTP expired!" });
    }

    if (parseInt(otp) !== otpStore[email].otp) {
      return res.json({ success: false, message: "Invalid OTP!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone || '',
      address: address || '',
      role: role || 'customer'
    });

    const user = await newUser.save();

    delete otpStore[email];

    const token = createToken(user._id);

    //If user role is delivery_man
    if (role === "delivery_man") {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/deliveryMan/add",
          { name:name, user: user._id, status: "active" }
        );
      } catch (error) {
        console.error("Error adding delivery man:", error.response?.data || error.message);
      }
    }

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


//get all user
const getUserList = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.json({ success: true, data: users });
  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    await userModel.updateOne(
      { _id: req.body.userId }, {
      $set: {
        name: req.body.user.name,
        phone: req.body.user.phone,
        address: req.body.user.address
      }
    }
    )
    res.json({ success: true, message: "update successfully" })
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
    const user = await userModel.findById(req.body.userId);
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

//reset password

const sendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.json({ success: false, message: "Email not found!" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  let transporter = nodemailer.createTransport({ service: "gmail", auth: { user: "mainuddin01718887159@gmail.com", pass: "dxxstvxdnzwvbqww" } });

  await transporter.sendMail({ to: email, subject: "Reset Password OTP", text: `Your OTP: ${otp}` });
  res.json({ success: true });
};

const verifyOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (otpStore[email] !== parseInt(otp)) return res.json({ success: false, message: "Invalid OTP!" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userModel.updateOne({ email }, { password: hashedPassword });

  delete otpStore[email];
  res.json({ success: true });
};

export { loginUser, registerUser, getUserProfile, updateUserProfile, updatePassword, getUserList, sendOtp, verifyOtp, sendOtpForRegister };
