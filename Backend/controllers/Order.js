import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js'; 
import DeliveryMan from '../models/deliveryManModel.js'
import Stripe from 'stripe'

//video
const stripe =new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req,res) => {
  const frontend_url ="http://localhost:5174"
    try{
      const newOrder =new orderModel({
        userId:req.body.userId,
        items:req.body.items,
        amount:req.body.amount,
        address:req.body.address
      })
      await newOrder.save();
     // await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

      const line_items =req.body.items.map((item)=>({
        price_data:{
          currency:"inr",
          product_data:{
            name:item.name
          },
          unit_amount:item.price*100
        },
        quantity:item.quantity
      }))

      line_items.push({
        price_data:{
          currency:"inr",
          product_data:{
            name:"Delivery Charges"
          },
          unit_amount:5*100
        },
        quantity:1
      })

      const session =await stripe.checkout.sessions.create({
        line_items:line_items,
        mode:'payment',
        success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
      });

      res.json({success:true,session_url:session.url})

    }catch(error){
      console.log(error.message);
      res.json({success:false,message:"Error"})
    }
}

const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try{
      if(success=="true"){
        await orderModel.findByIdAndUpdate(orderId,{payment:true});
        res.json({success:true,message:"Paid"})
      }
      else{
        await orderModel.findByIdAndDelete(orderId);
        res.json({success:false,message:"Not Paid"});
      }
    }
    catch(error){
      console.log(error);
      res.json({success:false,message:"Error"});
    }
} 

//user orders for frontend
const userOrders = async (req,res) => {
      try{
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders});
      }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
      }
}

//listing orders for admin panel
const listOrders = async (req,res) => {
    try{
      const orders = await orderModel.find({});
      res.json({success:true,data:orders});
    }catch(error){
      console.log(error);
      res.json({success:false,message:"error"});
    }
}

//update order status
const updateStatus = async (req, res) => {
      try{
          await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
          res.json({success:true,message:"Status Updated"})
      }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});

      }
}


//end

// const updateStatus = async (req, res) => {
//   const { orderId } = req.params;
//   const { status } = req.body;

//   try {
//     const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     res.status(200).json({ message: 'Order status updated successfully', order });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating order status', error });
//   }
// };

// const assignDeliveryPersonnel = async (req, res) => {
//   const { orderId } = req.params;
//   const { deliveryManId } = req.body;

//   try {
//     // চেক করুন যে ইউজারের role হলো delivery_man
//     const deliveryMan = await userModel.findById(deliveryManId);
//     if (!deliveryMan || deliveryMan.role !== 'delivery_man') {
//       return res.status(400).json({ message: 'Invalid delivery man ID or role' });
//     }

//     const order = await orderModel.findByIdAndUpdate(orderId, { deliveryManId }, { new: true });
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     res.status(200).json({ message: 'Delivery personnel assigned successfully', order });
//   } catch (error) {
//     res.status(500).json({ message: 'Error assigning delivery personnel', error });
//   }
// };

//  const assignDeliveryMan = async (req, res) => {
//   try {
//       const { orderId } = req.body;

//       if (!orderId) {
//         return res.status(400).json({ success: false, message: "Order ID is required" });
//     }

//     console.log("Received orderId:", orderId);

//        // Find the order to check if a delivery man is already assigned
//        const existingOrder = await orderModel.findById(orderId);

//        if (!existingOrder) {
//            return res.status(404).json({ success: false, message: "Order not found" });
//        }

//        if (existingOrder.assignedDeliveryMan) {
//         return res.status(400).json({ success: false, message: "Delivery Man Already Assigned" });
//     }

//       // Find all active delivery men
//       const activeDeliveryMen = await DeliveryMan.find({ status: "active" });

//       if (activeDeliveryMen.length === 0) {
//           return res.status(400).json({ success: false, message: "Delivery Man Busy" });
//       }

//       // Select a random delivery man
//       const randomDeliveryMan = activeDeliveryMen[Math.floor(Math.random() * activeDeliveryMen.length)];

//       // Assign delivery man to the order
//       const order = await orderModel.findByIdAndUpdate(orderId, { assignedDeliveryMan: randomDeliveryMan._id }, { new: true });

//       // Update delivery man status to busy
//       await DeliveryMan.findByIdAndUpdate(randomDeliveryMan._id, { status: "allocated" });

//       res.status(200).json({ success: true, message: "Delivery Man Assigned", data: order });
//   } catch (error) {
//       res.status(500).json({ success: false, message: "Error assigning delivery man", error });
//   }
// };

const assignDeliveryMan = async (req, res) => {
  try {
      const { orderId } = req.body;

      // Check if order exists
      const existingOrder = await orderModel.findById(orderId);
      if (!existingOrder) {
          return res.status(404).json({ success: false, message: "Order not found" });
      }

      // Check if order already has a delivery man assigned
      if (existingOrder.assignedDeliveryMan) {
          return res.status(200).json({ success: false, message: "Delivery Man Already Assigned" });
      }

      // Find active delivery men
      const activeDeliveryMen = await DeliveryMan.find({ status: "active" });

      if (activeDeliveryMen.length === 0) {
          return res.status(200).json({ success: false, message: "Delivery Man Busy" });
      }

      // Select a random delivery man
      const randomDeliveryMan = activeDeliveryMen[Math.floor(Math.random() * activeDeliveryMen.length)];

      // Assign delivery man to the order
      const order = await orderModel.findByIdAndUpdate(orderId, { assignedDeliveryMan: randomDeliveryMan._id }, { new: true });

      // Update delivery man status to allocated
      await DeliveryMan.findByIdAndUpdate(randomDeliveryMan._id, { status: "allocated" });

      res.status(200).json({ success: true, message: "Delivery Man Assigned", data: order });
  } catch (error) {
      console.error("Error in assignDeliveryMan:", error);
      res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};


export { updateStatus, assignDeliveryMan,placeOrder,verifyOrder ,userOrders ,listOrders };