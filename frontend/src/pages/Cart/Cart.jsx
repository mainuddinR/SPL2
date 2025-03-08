import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, updateCartItemQuantity, promos,setTotalPrice } = useContext(StoreContext);
  //new
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const applyPromoCode = () => {
    const promo = promos.find(p => p.code === promoCode);

    if (promo) {
      const discountValue = promo.discount / 100;
      const applicableItems = food_list.filter(item => item.category === promo.category);

      let totalDiscount = 0;

      applicableItems.forEach(item => {
        const cartItem = cartItems.find(cart => cart.itemId._id === item._id);
        if (cartItem) {
          totalDiscount += item.price * cartItem.quantity * discountValue;
        }
      });

      setDiscount(promo.discount);
      setDiscountAmount(totalDiscount);
    } else {
      setDiscount(0);
      setDiscountAmount(0);
      alert("Invalid Promo Code!");
    }
    setPromoCode("");
  };
  
  const navigate = useNavigate();

  const proceedToCheckout = ()=>{
    const total=getTotalCartAmount();
    setTotalPrice(total-discountAmount);
    navigate('/order')
  }

  //end

  return (
    <div className='cart'>
      <div className='cart-items'>
        <div className='cart-items-title'>
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          const cartItem = cartItems.find(cart => cart.itemId._id === item._id);

          if (cartItem) {
            return (
              <div>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>&#2547;{item.price}</p>
                  <p>{cartItem.quantity}</p>
                  <p>&#2547;{item.price * cartItem.quantity}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>&#2547;{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>&#2547;{getTotalCartAmount() === 0 ? 0 : 5}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Discount ({discount}%)</p>
              <p>- &#2547;{discountAmount}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>&#2547;{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5 - discountAmount}</b>
            </div>
          </div>
          <button onClick={proceedToCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder='Promo code'
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={applyPromoCode}>Submit</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
