import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
//import {loadStripe} from '@stripe/stripe-js'

//const stripePromise = loadStripe('pk_test_51Qs6ulPpCsrbPdRYQgyHCyBiBoCdHyW6Pdfw2qURP69QJfHy9nlIl3jrs6O9Hufx074rt0CxqYDWyt85d3vA2lbq00t1yzahHv')

const PlaceOrder = () => {

  const { getTotalCartAmount ,cartItems,token,food_list,url } = useContext(StoreContext);
  const [paymentMethod,setPaymentMethod] =useState('');
  const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    zipcode:"",
    division:"",
    phone:"",
    district:""
  })

  const onChangeHandler =(event) => {
    const name = event.target.name;
    const value =event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const placeOrder = async (event) =>{
        event.preventDefault();
        let orderItems=[];
        food_list.map((item)=>{
          const cartItem=cartItems.find(cart=>cart.itemId._id===item._id);
          if(cartItem&&cartItem.quantity>0){
            // let itemInfo =item;
            // itemInfo["quantity"] = cartItem.quantity;
            // orderItems.push(itemInfo);
            orderItems.push({
              itemId: item._id, 
              name: item.name,
              price: item.price,
              quantity: cartItem.quantity
          });
          }
        });
        if (orderItems.length === 0) {
          alert("No items in the cart!");
          return;
      }

        let orderData ={
          address:data,
          items:orderItems,
          amount:getTotalCartAmount()+5,
        }
        let response = await axios.post(url+"/api/orders/place",orderData,{headers:{token}});
        if(response.data.success){
          const {session_url}=response.data;
          window.location.replace(session_url);
        }
        else{
          //alert("Error");
          alert("Order placement failed. Please check your order details.");
          console.log("Server Response:", response.data);
        }
        console.log("Final Order Data:", orderData);
  }

  const navigate=useNavigate();

useEffect(()=>{
  if(!token){
      navigate('/cart');
  }else if(getTotalCartAmount()===0){
    navigate('/cart');
  }
},[token])
  // useEffect(()=>{
  //   console.log(data);
  // },[data]);

  // const handlePayment = async () => {
  //   if (paymentMethod === 'online') {
  //     const stripe = await stripePromise;
  //     try {
  //       const response = await fetch('/create-checkout-session', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ cartItems }), // cart items সার্ভারে পাঠাচ্ছি
  //       });

  //       const session = await response.json();

  //       // Stripe Checkout এ রিডাইরেক্ট
  //       const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

  //       if (error) {
  //         console.error('Stripe checkout error:', error);
  //       }
  //     } catch (error) {
  //       console.error('Payment Error:', error);
  //     }
  //   } else {
  //     alert('Payment method not selected');
  //   }
  // };


  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required type="text" onChange={onChangeHandler} value={data.firstName} placeholder='First name' name='firstName' />
          <input required type="text" onChange={onChangeHandler} value={data.lastName} placeholder='Last name' name='lastName' />
        </div>
        <input required type="text" onChange={onChangeHandler} value={data.email} placeholder='Email address' name='email'/>
        <input required type="text" onChange={onChangeHandler} value={data.street} placeholder='Street' name='street'/>
        <div className="multi-fields">
          <input required type="text" onChange={onChangeHandler} value={data.city} placeholder='City' name='city'/>
          <input required type="text" onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' name='zipcode'/>
        </div>
        <div className="multi-fields">
          <input required type="text" onChange={onChangeHandler} value={data.district} placeholder='District' name='district'/>
          <input required type="text" onChange={onChangeHandler} value={data.division} placeholder='Division' name='division'/>
        </div>
        <input required type="text" onChange={onChangeHandler} value={data.phone} placeholder='Phone' name='phone'/>
      </div>
      <div className="place-order-right">
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
              <b>Total</b>
              <b>&#2547;{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</b>
            </div>
          </div>
         <div className="paymentMethod">
            <p>Payment Method</p>
            
              <label>
                <input required type="radio" name="payment" value="online" onChange={() => setPaymentMethod('online')} /> Online
              </label>
              <label>
                <input type="radio" name="payment" value="offline" onChange={() => setPaymentMethod('offline')} /> Offline
              </label>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
