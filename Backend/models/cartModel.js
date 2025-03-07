import mongoose from "mongoose";

  const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "item", required: true },
        quantity: { type: Number, required: true , min:1 },
      },
    ],
    discount:{ type: Number,required:true, default: 0 },
    totalPrice: { type: Number,required:true, default: 0 },
    createdAt: { type: Date, default: Date.now }
  });  
  
  const cartModel = mongoose.models.Cart|| mongoose.model('Cart', cartSchema);
  
  export default cartModel;