import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'online'], required: true },
  transactionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const paymentModel = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
  
export default paymentModel;