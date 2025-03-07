import React from 'react'
import './Orders.css'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { assets } from '../../assets/assets.js'
const Orders = ({ url }) => {

  const [orders, setOrders] = useState([]);

  const fetchAllorders = async () => {
    const response = await axios.get(url + "/api/orders/listorder");
    if (response.data.success) {
      const filteredOrders = response.data.data.filter(order => order.status !== "Delivered");
      setOrders(filteredOrders);
      console.log(filteredOrders);
    } else {
      toast.error("Error");
    }
  };

  // const statushandler = async (event ,orderId) =>{
  //    const response = await axios.post(url+"/api/orders/status",{
  //     orderId,
  //     status:event.target.value
  //    })
  //    if(response.data.success){
  //      await fetchAllorders();
  //    }
  // }

  const removeOrder = (orderId) => {
    setOrders(orders.filter(order => order._id !== orderId));
  };

  const assignDeliveryMan = async (orderId) => {
    try {
      const response = await axios.post("http://localhost:4000/api/orders/assignDeliveryMan", { orderId });

      if (response.data.success) {
        toast.success("Delivery Man Assigned");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error assigning delivery man:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to assign delivery man");
    }
  };

  useEffect(() => {
    fetchAllorders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity
                  }
                  else {
                    return item.name + " x " + item.quantity + " , "
                  }
                })}
              </p>
              <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className='order-item-address'>
                <p>{order.address.street + " , "}</p>
                <p>{order.address.city + " , " + order.address.zipcode + " , " + order.address.district + " , " + order.address.division}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Item:{order.items.length}</p>
            <p>Amount:{order.amount}</p>

            {order.assignedDeliveryMan ? (
              <>
                <p style={{ color: "green", fontWeight: "bold" }}>Delivery Man Assigned</p>
                <button className='removeOrder' onClick={() => removeOrder(order._id)}>Remove</button>
              </>
            ) : (
              <button className='assignDeliveryMan' onClick={() => assignDeliveryMan(order._id)}>Assign Delivery Man</button>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
