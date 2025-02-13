import mongoose from "mongoose";

// const itemSchema = new mongoose.Schema({
//     itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item', required: true },
//     quantity: { type: Number, required: true ,min:1}
//   });
  
  const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "item", required: true },
        quantity: { type: Number, required: true , min:1 },
      },
    ],
    totalPrice: { type: Number,required:true, default: 0 },
    createdAt: { type: Date, default: Date.now }
  });
  
  // cartSchema.methods.calculateTotal = function() {
  //   this.totalPrice = this.items.reduce((acc, item) => acc + item.quantity, 0);
  //   return this.totalPrice;
  // };
  
  const cartModel = mongoose.models.Cart|| mongoose.model('Cart', cartSchema);
  
  export default cartModel;