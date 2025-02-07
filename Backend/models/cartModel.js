import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    quantity: { type: Number, required: true }
  });
  
  const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [itemSchema],
    totalPrice: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  });
  
  cartSchema.methods.calculateTotal = function() {
    this.totalPrice = this.items.reduce((acc, item) => acc + item.quantity, 0);
    return this.totalPrice;
  };
  
  const cartModel = mongoose.model('Cart', cartSchema);
  
  export default cartModel;