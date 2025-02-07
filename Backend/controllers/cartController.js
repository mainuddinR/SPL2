import userModel from "../models/userModel.js"
import Cart from "../models/cartModel.js";

//add items to user cart
const addToCart = async (req ,res) => {
    try{
        let userData =await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId] = 1;
        }
        else{
            cartData[req.body.itemId] +=1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Added to Cart"});
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

//remove items from user cart
const removeFromCart = async (req, res) => {
    try{
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -=1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Romoved From Cart"});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

//fetch user cart data 
const getCart = async (req,res) => {
    try{
        let userData = await userModel.findById(req.body.userId);
        let cartData =await userData.cartData;
        res.json({success:true,cartData});
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}


//new alada

exports.addItem = async (req, res) => {
    try {
      const { userId, itemId, quantity } = req.body;
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({ userId, items: [{ itemId, quantity }] });
      } else {
        const existingItem = cart.items.find(item => item.itemId.equals(itemId));
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ itemId, quantity });
        }
      }
  
      cart.calculateTotal();
      await cart.save();
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.removeItem = async (req, res) => {
    try {
      const { userId, itemId } = req.body;
      const cart = await Cart.findOne({ userId });
  
      if (cart) {
        cart.items = cart.items.filter(item => !item.itemId.equals(itemId));
        cart.calculateTotal();
        await cart.save();
        res.status(200).json(cart);
      } else {
        res.status(404).json({ message: 'Cart not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.updateQuantity = async (req, res) => {
    try {
      const { userId, itemId, quantity } = req.body;
      const cart = await Cart.findOne({ userId });
  
      if (cart) {
        const item = cart.items.find(item => item.itemId.equals(itemId));
        if (item) {
          item.quantity = quantity;
          cart.calculateTotal();
          await cart.save();
          res.status(200).json(cart);
        } else {
          res.status(404).json({ message: 'Item not found in cart' });
        }
      } else {
        res.status(404).json({ message: 'Cart not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.getCart = async (req, res) => {
    try {
      const { userId } = req.params;
      const cart = await Cart.findOne({ userId }).populate('items.itemId');
      if (cart) {
        res.status(200).json(cart);
      } else {
        res.status(404).json({ message: 'Cart not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

//end

export {addToCart,removeFromCart,getCart}