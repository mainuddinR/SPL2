import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({ id, name, price, description, image }) => {

    const { cartItems, addToCart, removeFromCart, url, updateCartItemQuantity } = useContext(StoreContext);
    const cartItem = cartItems.find(item => item.itemId._id === id);
    let quantity;
    quantity = cartItem ? cartItem.quantity :0;

    const handleAddToCart = () => {
        if (quantity === 0) {
            addToCart(id);  
        } else {
            updateCartItemQuantity(id, quantity + 1);
        }
    };
    const handleRemoveFromCart = () => {
        if (quantity > 0) {
            if (quantity === 1) {
                removeFromCart(id); 
            } else {
                updateCartItemQuantity(id, quantity - 1); 
            }
        }
    };

    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className='food-item-image' src={url + "/images/" + image} alt="" />
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
}

export default FoodItem




