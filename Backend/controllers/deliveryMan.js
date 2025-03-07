import deliveryMan from "../models/deliveryManModel.js";
import userModel from "../models/userModel.js";
import orderModel from '../models/orderModel.js'

// Get all delivery men
const getAllDeliveryMen = async (req, res) => {
  try {
    const deliveryMen = await deliveryMan.find().populate("user", "name email"); // Populate user info
    res.status(200).json(deliveryMen);
  } catch (error) {
    res.status(500).json({ message: "Error fetching delivery men", error });
  }
};

// Add a new delivery man
const addDeliveryMan = async (req, res) => {
  try {
    const { name, user, status } = req.body;

    if (!name || !user) {
      return res.status(400).json({ message: "Name and user ID are required" });
    }

    const newDeliveryMan = new deliveryMan({ name, user, status });
    await newDeliveryMan.save();

    res.status(201).json({ message: "Delivery man added successfully", data: newDeliveryMan });
  } catch (error) {
    res.status(500).json({ message: "Error adding delivery man", error });
  }
};
// Find Delivery Man by User Email
const findByUserEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, data: user });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error finding user", error });
  }
};

const getAssignedOrders = async (req, res) => {
  try {
    const userId = req.body.userId; // Authenticated user ID

    const deliveryman = await deliveryMan.findOne({ user: userId });

    if (!deliveryman) {
      return res.status(404).json({ success: false, message: "Delivery Man not found" });
    }

    const orders = await orderModel.find({
      assignedDeliveryMan: deliveryman._id,
      status: { $ne: 'Delivered' } 
    });
  
    res.status(200).json({ success: true, data: orders });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders", error });
  }
};


const updateDeliveryManStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await deliveryMan.findOneAndUpdate({ user: req.body.userId }, { status });
    res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};
const getStatus = async (req, res) => {
  try {
    const deliveryman = await deliveryMan.findOne({ user: req.body.userId });
    if (!deliveryman) {
      return res.json({ success: false, message: "Delivery man not found" });
    }
    res.json({ success: true, status: deliveryman.status });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}


export { addDeliveryMan, getAllDeliveryMen, findByUserEmail, getAssignedOrders, updateDeliveryManStatus, getStatus };
