import orderModel from '../models/orderModel.js';
//import userModel from '../models/userModel.js'; 
import DeliveryMan from '../models/deliveryManModel.js'
import Stripe from 'stripe'
import cartModel from '../models/cartModel.js';

const stripe =new Stripe(process.env.STRIPE_SECRET_KEY)

// const placeOrder = async (req,res) => {
//   const frontend_url ="http://localhost:5174"
//     try{
//       const newOrder =new orderModel({
//         userId:req.body.userId,
//         items:req.body.items,
//         amount:req.body.amount,
//         address:req.body.address
//       })
//       await newOrder.save();
//      // await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

//       const line_items =req.body.items.map((item)=>({
//         price_data:{
//           currency:"inr",
//           product_data:{
//             name:item.name
//           },
//           unit_amount:item.price*100
//         },
//         quantity:item.quantity
//       }))

//       line_items.push({
//         price_data:{
//           currency:"inr",
//           product_data:{
//             name:"Delivery Charges"
//           },
//           unit_amount:5*100
//         },
//         quantity:1
//       })

//       const session =await stripe.checkout.sessions.create({
//         line_items:line_items,
//         mode:'payment',
//         success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//         cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
//       });

//       res.json({success:true,session_url:session.url})

//     }catch(error){
//       console.log(error.message);
//       res.json({success:false,message:"Error"})
//     }
// }

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: req.body.payment  
    });

    await newOrder.save();
    
    await cartModel.findOneAndDelete({userId:req.body.userId});

    if (!req.body.payment) {//if offline
      return res.json({ success: true, message: "Order placed successfully!" });
    }

    // Online payment... Stripe Session 
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 5 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Error" });
  }
};


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
const userOrders = async (req, res) => {
  try {
      const orders = await orderModel.find({
          userId: req.body.userId,
          status: { $ne: 'Delivered' } 
      });

      res.json({ success: true, data: orders });
  } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
  }
};


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

const assignDeliveryMan = async (req, res) => {
  try {
      const { orderId } = req.body;

      const existingOrder = await orderModel.findById(orderId);
      if (!existingOrder) {
          return res.status(404).json({ success: false, message: "Order not found" });
      }
      if (existingOrder.assignedDeliveryMan) {
          return res.status(200).json({ success: false, message: "Delivery Man Already Assigned" });
      }
      const activeDeliveryMen = await DeliveryMan.find({ status: "active" });

      if (activeDeliveryMen.length === 0) {
          return res.status(200).json({ success: false, message: "Delivery Man Busy" });
      }

      const randomDeliveryMan = activeDeliveryMen[Math.floor(Math.random() * activeDeliveryMen.length)];

      const order = await orderModel.findByIdAndUpdate(orderId, { assignedDeliveryMan: randomDeliveryMan._id }, { new: true });

      await DeliveryMan.findByIdAndUpdate(randomDeliveryMan._id, { status: "allocated" });

      res.status(200).json({ success: true, message: "Delivery Man Assigned", data: order });
  } catch (error) {
      console.error("Error in assignDeliveryMan:", error);
      res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};

const pastOrders = async (req, res) => {
  try {
      const userId = req.body.userId;
      const pastOrders = await orderModel.find({ userId, status: "Delivered" }).sort({ date: -1 });

      res.json({ success: true, data: pastOrders });
  } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export { updateStatus, assignDeliveryMan,placeOrder,verifyOrder ,userOrders ,listOrders,pastOrders };