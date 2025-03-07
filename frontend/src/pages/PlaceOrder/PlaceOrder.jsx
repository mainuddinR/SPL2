import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const { getTotalCartAmount ,cartItems,token,food_list,url,fetchCartData } = useContext(StoreContext);
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

  // const placeOrder = async (event) =>{
  //       event.preventDefault();
  //       let orderItems=[];
  //       food_list.map((item)=>{
  //         const cartItem=cartItems.find(cart=>cart.itemId._id===item._id);
  //         if(cartItem&&cartItem.quantity>0){
  //           // let itemInfo =item;
  //           // itemInfo["quantity"] = cartItem.quantity;
  //           // orderItems.push(itemInfo);
  //           orderItems.push({
  //             itemId: item._id, 
  //             name: item.name,
  //             price: item.price,
  //             quantity: cartItem.quantity
  //         });
  //         }
  //       });
  //       if (orderItems.length === 0) {
  //         alert("No items in the cart!");
  //         return;
  //     }

  //       let orderData ={
  //         address:data,
  //         items:orderItems,
  //         amount:getTotalCartAmount()+5,
  //       }
  //       let response = await axios.post(url+"/api/orders/place",orderData,{headers:{token}});
  //       if(response.data.success){
  //         const {session_url}=response.data;
  //         window.location.replace(session_url);
  //       }
  //       else{
  //         //alert("Error");
  //         alert("Order placement failed. Please check your order details.");
  //         console.log("Server Response:", response.data);
  //       }
  //       console.log("Final Order Data:", orderData);
  // }


  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      const cartItem = cartItems.find(cart => cart.itemId._id === item._id);
      if (cartItem && cartItem.quantity > 0) {
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
  
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 5,
      payment: paymentMethod === "offline" ? false : true, 
    };
  
    try {
      let response = await axios.post(url + "/api/orders/place", orderData, { headers: { token } });
  
      if (response.data.success) {
        if (paymentMethod === "online") {
          const { session_url } = response.data;
          window.location.replace(session_url);
        } else if(paymentMethod==="offline") {
          alert("Order Placed Successfully! Payment will be collected on delivery.");
          navigate("/myorders");
        }
      } else {
        alert("Order placement failed. Please check your order details.");
      }
    } catch (error) {
      console.error("Order Placement Error:", error);
      //alert("Something went wrong!");
    }
  };
  

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

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required type="text" onChange={onChangeHandler} value={data.firstName} placeholder='First name' name='firstName' />
          <input required type="text" onChange={onChangeHandler} value={data.lastName} placeholder='Last name' name='lastName' />
        </div>
        <input required type="email" onChange={onChangeHandler} value={data.email} placeholder='Email address' name='email'/>
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
