import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
//   items: [
//     {
//       itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item', required: true },
//       quantity: { type: Number, required: true },
//       price: { type: Number, required: true }
//     }
//   ],
//   deliveryAddress: { type: String, required: true },
//   deliveryManId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
//   paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
//   status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
//   createdAt: { type: Date, default: Date.now }
// });

// const orderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

const orderSchema = new mongoose.Schema({
  userId:{type:String,required:true},
  items:{type:Array,required:true},
  amount:{type:Number,required:true},
  address:{type:Object,required:true},
  status:{type:String,default:"Food Processing"},
  assignedDeliveryMan: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryMan", default: null },
  date:{type:Date,default:Date.now()},
  payment:{type:Boolean,default:false}
})

const orderModel = mongoose.models.Order || mongoose.model('Order',orderSchema);

export default orderModel;