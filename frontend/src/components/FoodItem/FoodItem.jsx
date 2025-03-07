import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
//import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({ id, name, price, description, image }) => {

    //const [itemCount,setItemCount] = useState(0)
    const { cartItems, addToCart, removeFromCart, url, updateCartItemQuantity } = useContext(StoreContext);

    //console.log("Total",cartItems);

    // Find the cart item by itemId from cartItems
    const cartItem = cartItems.find(item => item.itemId._id === id);
   // console.log("onClick",cartItem)
    // Get quantity of the item from cartItem
    let quantity;
    quantity = cartItem ? cartItem.quantity :0;

    const handleAddToCart = () => {
        if (quantity === 0) {
            addToCart(id);  // First time adding item, set quantity to 1
        } else {
            // If the item is already in the cart, just increase the quantity
            updateCartItemQuantity(id, quantity + 1);
        }
    };
    const handleRemoveFromCart = () => {
        if (quantity > 0) {
            // If quantity is greater than 1, reduce it, otherwise remove the item from the cart
            if (quantity === 1) {
                removeFromCart(id);  // Remove item if quantity is 1
            } else {
                updateCartItemQuantity(id, quantity - 1);  // Decrease quantity
            }
        }
    };

    //   return (
    //     <div className='food-item'>
    //         <div className="food-item-img-container">
    //             <img className='food-item-image' src={url+"/images/"+image} alt="" />
    //             {quantity===0
    //                 ?<img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt=''/>
    //                 :<div className='food-item-counter'>
    //                     <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
    //                     <p>{quantity}</p>
    //                     <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" />
    //                 </div>

    //             }
    //         </div>
    //         <div className="food-item-info">
    //             <div className="food-item-name-rating">
    //                 <p>{name}</p>
    //                 <img src={assets.rating_starts} alt="" />
    //             </div>
    //             <p className="food-item-desc">{description}</p>
    //             <p className="food-item-price">&#2547;{price}</p>
    //         </div>

    //     </div>
    //   )
    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className='food-item-image' src={url + "/images/" + image} alt="" />
                
                {/* {quantity===0 ? (
                    <img className='add' onClick={handleAddToCart} src={assets.add_icon_white} alt='' />
                ) : (
                    <div className='food-item-counter'>
                        <img onClick={handleRemoveFromCart} src={assets.remove_icon_red} alt="" />
                        <p>{quantity}</p>
                        <img onClick={handleAddToCart} src={assets.add_icon_green} alt="" />
                    </div>
                )} */}
                {quantity >= 1 ? (
                    <div className='food-item-counter'>
                        <img onClick={handleRemoveFromCart} src={assets.remove_icon_red} alt="Remove" />
                        <p>{quantity}</p>
                        <img onClick={handleAddToCart} src={assets.add_icon_green} alt="Add" />
                    </div>
                ) : (
                    <img className='add' onClick={handleAddToCart} src={assets.add_icon_white} alt='' />
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">&#2547;{price}</p>
            </div>
        </div>
    );

    // return (
    //     <div className='food-item'>
    //         <div className="food-item-img-container">
    //             <img className='food-item-image' src={`${url}/images/${image}`} alt={name} />
    //             {!cartItems || !cartItems[id] ? (
    //                 <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt='' />
    //             ) : (
    //                 <div className='food-item-counter'>
    //                     <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
    //                     <p>{cartItems[id]}</p>
    //                     <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
    //                 </div>
    //             )}
    //         </div>
    //         <div className="food-item-info">
    //             <div className="food-item-name-rating">
    //                 <p>{name}</p>
    //                 <img src={assets.rating_starts} alt="Rating" />
    //             </div>
    //             <p className="food-item-desc">{description}</p>
    //             <p className="food-item-price">&#2547;{price}</p>
    //         </div>
    //     </div>
    // );
}

export default FoodItem
