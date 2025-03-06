import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./orderRecord.css";

const OrderRecord = () => {
  const { url, token } = useContext(StoreContext);
  const [pastOrders, setPastOrders] = useState([]);

  const fetchPastOrders = async () => {
    try {
      const response = await axios.get(url + "/api/orders/past", {
        headers: { token },
      });
      setPastOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching past orders", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPastOrders();
    }
  }, [token]);

  return (
    <div className="order-record">
      <h2>Past Orders</h2>
      <div className="order-list">
        {pastOrders.length > 0 ? (
          pastOrders.map((order, index) => (
            <div key={index} className="order-card">
              <img src={order.items[0]?.image || "default-image.jpg"} alt="Food" />
              <div className="order-details">
                <h3>{order.address.restaurantName}</h3>
                <p>Delivered on {new Date(order.date).toLocaleString()}</p>
                <p>{order.items.map((item) => `${item.name} - ${item.quantity}`).join(", ")}</p>
                <p><b>৳ {order.amount}</b></p>
                <button>Select items to reorder</button>
              </div>
            </div>
          ))
        ) : (
          <p>No past orders found.</p>
        )}
      </div>
    </div>
  );
};

export default OrderRecord;
