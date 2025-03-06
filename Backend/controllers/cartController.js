import userModel from "../models/userModel.js"
import CartModel from "../models/cartModel.js"
import ItemModel from "../models/AdminModel.js"

//add items to user cart
// const addToCart = async (req ,res) => {
//     try{
//         let userData =await userModel.findById(req.body.userId);
//         let cartData = await userData.cartData;
//         if(!cartData[req.body.itemId]){
//             cartData[req.body.itemId] = 1;
//         }
//         else{
//             cartData[req.body.itemId] +=1;
//         }
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData});
//         res.json({success:true,message:"Added to Cart"});
//     }catch(error){
//         console.log(error);
//         res.json({success:false,message:"Error"});
//     }
// }

// //remove items from user cart
// const removeFromCart = async (req, res) => {
//     try{
//         let userData = await userModel.findById(req.body.userId)
//         let cartData = await userData.cartData;
//         if(cartData[req.body.itemId]>0){
//             cartData[req.body.itemId] -=1;
//         }
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData});
//         res.json({success:true,message:"Romoved From Cart"});
//     }
//     catch(error){
//         console.log(error);
//         res.json({success:false,message:"Error"});
//     }
// }

// //fetch user cart data 
// const getCart = async (req,res) => {
//     try{
//         let userData = await userModel.findById(req.body.userId);
//         let cartData =await userData.cartData;
//         res.json({success:true,cartData});
//     }catch(error){
//         console.log(error);
//         res.json({success:false,message:"Error"});
//     }
// }


//new alada
// const getCart = async (req, res) => {
//     try {
//       const { userId } = req.params;
//       const cart = await CartModel.findOne({ userId }).populate("items.itemId");
//       if (!cart) {
//         return res.status(404).json({ message: "Cart not found" });
//       }
//       res.status(200).json(cart);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };

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


// Add item to cart
// const addItemToCart = async (req, res) => {
//     try {
//       const { userId, itemId, quantity } = req.body;

//       // Check if the item exists
//       const item = await ItemModel.findById(itemId);
//       if (!item) {
//         return res.status(404).json({ message: "Item not found" });
//       }

//       const parsedQuantity = parseInt(quantity, 10);
//       //console.log("ITEM: "+item);
//       // Find or create a cart for the user
//       //let cart = await CartModel.findOne({ userId });
//       //let cart = await CartModel.findOne({ userId }).populate("items.itemId");
//       const cart = await CartModel.findOne({ userId }).populate("items.itemId");
//       if (!cart) {
//         //console.log("New cart create");
//         cart = new CartModel({ userId, items: [] });
//       }
//       //console.log("Cart: "+cart);

//       // Check if the item already exists in the cart
//       const existingItem = cart.items.find((i) => i.itemId._id.toString() === itemId);
//       if (existingItem) {
//         //console.log("Existing Item add");
//         existingItem.quantity += parsedQuantity;
//       } else {
//         //console.log("New item push");
//         cart.items.push({ itemId, quantity:parsedQuantity});
//       }
//       //console.log("item push : "+cart);

//       // Calculate total price
//       cart.totalPrice = cart.items.reduce((total, i) => {
//         return total + i.itemId.price * i.quantity;
//       }, 0);

//       // Save the cart
//       await cart.save();
//       res.status(200).json(cart);
//     } catch (error) {
//         //console.log("catch error")
//       res.status(500).json({ message: error.message });
//     }
//   };

const addItemToCart = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    // Ensure the item exists
    const item = await ItemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // Find or create a cart for the user
    let cart = await CartModel.findOne({ userId }).populate("items.itemId");

    if (!cart) {
      cart = new CartModel({ userId, items: [], totalPrice: 0 });
    }

    // Check if the item already exists in the cart
    const existingItem = cart.items.find((i) => i.itemId._id.toString() === itemId);
    if (existingItem) {
      existingItem.quantity += parsedQuantity;
    } else {
      cart.items.push({ itemId, quantity: parsedQuantity });
    }

    // Ensure each item in the cart has a valid price before calculating totalPrice
    let totalPrice = 0;
    for (const i of cart.items) {
      const itemData = await ItemModel.findById(i.itemId); // Fetch the latest price
      if (itemData && itemData.price) {
        totalPrice += itemData.price * i.quantity;
      }
    }
    cart.totalPrice = totalPrice;

    // Save the cart
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Remove item from cart
const removeItemFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Find the cart and populate items.itemId
    const cart = await CartModel.findOne({ userId }).populate("items.itemId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }


    // Remove the item
    cart.items = cart.items.filter((i) => i.itemId._id.toString() !== itemId);


    //console.log("after remove:", cart.items);

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, i) => {
      //console.log("Total");
      //console.log(total, i, i.itemId.price, i.quantity);
      return total + i.itemId.price * i.quantity;
    }, 0);

    // Save the cart
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item quantity in cart
const updateItemQuantity = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    // Find the cart
    const cart = await CartModel.findOne({ userId }).populate("items.itemId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const item = cart.items.find((i) => i.itemId._id.toString() === itemId);
    if (item) {
      item.quantity = quantity;

      // Recalculate total price
      cart.totalPrice = cart.items.reduce((total, i) => total + i.itemId.price * i.quantity, 0);

      console.log("CART:" + cart);

      // Save the cart
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
