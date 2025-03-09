import userModel from "../models/userModel.js"
import CartModel from "../models/cartModel.js"
import ItemModel from "../models/itemModel.js"

const getCart = async (req, res) => {
  try {
    const userId = req.params.userId; 

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const cart = await CartModel.findOne({ userId }).populate("items.itemId");

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const addItemToCart = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    const item = await ItemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    let cart = await CartModel.findOne({ userId }).populate("items.itemId");

    if (!cart) {
      cart = new CartModel({ userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find((i) => i.itemId._id.toString() === itemId);
    if (existingItem) {
      existingItem.quantity += parsedQuantity;
    } else {
      cart.items.push({ itemId, quantity: parsedQuantity });
    }

    let totalPrice = 0;
    for (const i of cart.items) {
      const itemData = await ItemModel.findById(i.itemId); 
      if (itemData && itemData.price) {
        totalPrice += itemData.price * i.quantity;
      }
    }
    cart.totalPrice = totalPrice;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const removeItemFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const cart = await CartModel.findOne({ userId }).populate("items.itemId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((i) => i.itemId._id.toString() !== itemId);

    cart.totalPrice = cart.items.reduce((total, i) => {
      return total + i.itemId.price * i.quantity;
    }, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItemQuantity = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    const cart = await CartModel.findOne({ userId }).populate("items.itemId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

  
    const item = cart.items.find((i) => i.itemId._id.toString() === itemId);
    if (item) {
      item.quantity = quantity;

      cart.totalPrice = cart.items.reduce((total, i) => total + i.itemId.price * i.quantity, 0);

      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCartForReorder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.body.userId;

    let unavailableItems = [];
    let newCartItems = [];

    for (let item of items) {
      const product = await ItemModel.findById(item.itemId);
      if (!product) {
        unavailableItems.push(item.name);
      } else {
        newCartItems.push({
          itemId: product._id,
          quantity: item.quantity,
          price: product.price, 
        });
      }
    }

    if (unavailableItems.length > 0) {
      return res.json({ success: false, unavailableItems });
    }

    await CartModel.findOneAndDelete({ userId });

    const totalPrice = newCartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const newCart = new CartModel({ userId, items: newCartItems, totalPrice });
    await newCart.save();

    res.json({ success: true, message: "Cart updated successfully!" });
  } catch (error) {
    console.error("Error in reorder API:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export { addItemToCart, getCart, removeItemFromCart, updateItemQuantity,addToCartForReorder };
