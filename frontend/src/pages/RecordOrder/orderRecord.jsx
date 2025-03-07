// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { StoreContext } from "../../context/StoreContext";
// import "./orderRecord.css";

// const OrderRecord = () => {
//   const { url, token } = useContext(StoreContext);
//   const [pastOrders, setPastOrders] = useState([]);

//   const fetchPastOrders = async () => {
//     try {
//       const response = await axios.get(url + "/api/orders/past", {
//         headers: { token },
//       });
//       setPastOrders(response.data.data);
//     } catch (error) {
//       console.error("Error fetching past orders", error);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchPastOrders();
//     }
//   }, [token]);

//   return (
//     <div className="order-record">
//       <h2>Past Orders</h2>
//       <div className="order-list">
//         {pastOrders.length > 0 ? (
//           pastOrders.map((order, index) => (
//             <div key={index} className="order-card">
//               <img src={order.items[0]?.image || "default-image.jpg"} alt="Food" />
//               <div className="order-details">
//                 <h3>{order.address.restaurantName}</h3>
//                 <p>Delivered on {new Date(order.date).toLocaleString()}</p>
//                 <p>{order.items.map((item) => `${item.name} - ${item.quantity}`).join(", ")}</p>
//                 <p><b>৳ {order.amount}</b></p>
//                 <button>Select items to reorder</button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No past orders found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderRecord;

// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { StoreContext } from "../../context/StoreContext";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify"; // Toastify for notifications
// import "react-toastify/dist/ReactToastify.css";
// import "./orderRecord.css";
// import { assets } from "../../assets/assets";

// const OrderRecord = () => {
//   const { url, token, setCart } = useContext(StoreContext);
//   const [pastOrders, setPastOrders] = useState([]);
//   const navigate = useNavigate();

//   // Fetch past orders
//   const fetchPastOrders = async () => {
//     try {
//       const response = await axios.get(url + "/api/orders/past", {
//         headers: { token },
//       });
//       setPastOrders(response.data.data);
//     } catch (error) {
//       console.error("Error fetching past orders", error);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchPastOrders();
//     }
//   }, [token]);

//   // Handle reorder functionality
//   const handleReorder = async (order) => {
//     try {
//       const response = await axios.post(url + "/api/cart/check-availability", 
//         { items: order.items }, 
//         { headers: { token } }
//       );

//       if (response.data.available) {
//         setCart(order.items);
//         toast.success("Items added to cart successfully!");
//         navigate("/cart");
//       } else {
//         toast.error(`Some items are not available: ${response.data.unavailableItems.join(", ")}`);
//       }
//     } catch (error) {
//       console.error("Error checking item availability", error);
//       toast.error("Failed to reorder items. Please try again.");
//     }
//   };

//   return (
//     <div className="order-record">
//       <h2>Past Orders</h2>
//       <div className="order-list">
//         {pastOrders.length > 0 ? (
//           pastOrders.map((order, index) => (
//             <div key={index} className="order-card">
//               <img src={order.items[0]?.image || assets.parcel_icon} alt="Food" />
//               <div className="order-details">
//                 <h3>{order.address.restaurantName}</h3>
//                 <p>Delivered on {new Date(order.date).toLocaleString()}</p>
//                 <p>{order.items.map((item) => `${item.name} - ${item.quantity}`).join(", ")}</p>
//                 <p><b>৳ {order.amount}</b></p>
//                 <button onClick={() => navigate(`/feedback/${order._id}`)}>Give Feedback</button>
//                 <button className="reorder-btn" onClick={() => handleReorder(order)}>Reorder Items</button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No past orders found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderRecord;

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./orderRecord.css";

const OrderRecord = () => {
  const { url, token,fetchCartData } = useContext(StoreContext);
  const [pastOrders, setPastOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchPastOrders();
    }
  }, [token]);

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

  // Handle reorder functionality
  const handleReorder = async (order) => {
    try {
      const response = await axios.post(
        url + "/api/cart/reorder",
        { items: order.items },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Items added to cart!");
        fetchCartData();
        navigate("/cart");
      } else {
        toast.error(`Unavailable items: ${response.data.unavailableItems.join(", ")}`);
      }
    } catch (error) {
      console.error("Error reordering items", error);
      //toast.error("Failed to reorder items. Please try again.");
    }
  };

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
                <button onClick={() => navigate(`/feedback/${order._id}`)}>Give Feedback</button>
                <button className="reorder-btn" onClick={() => handleReorder(order)}>Reorder Items</button>
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
