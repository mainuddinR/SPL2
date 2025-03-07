import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './DeliveryManDashboard.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../../../Admin/src/assets/assets';

const DeliveryManDashboard = () => {
    const { token, url } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState(null);

    const fetchAssignedOrders = async () => {
        if (!token) return;
        try {
            const response = await axios.get(url + "/api/deliveryMan/assignOrder", {
                headers: { token }
            });
            if (response.data.success) {
                setOrders(response.data.data);
            } 
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    };

    const fetchStatus = async () => {
        if (!token) return;
        try {
            const response = await axios.get(url + "/api/deliveryMan/status", {
                headers: { token }
            });
            if (response.data.success) {
                setStatus(response.data.status);
            }
        } catch (error) {
            toast.error("Error fetching status");
        }
    };

    const updateStatus = async (newStatus) => {
        if (!token) return;
        try {
            await axios.post(url + "/api/deliveryMan/updateStatus", { status: newStatus }, {
                headers: { token }
            });
            setStatus(newStatus);
            toast.success("Status updated successfully");
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    const statushandler = async (event, orderId) => {
        if (!token) return;
        const newStatus = event.target.value;
        try {
            const response = await axios.post(url + "/api/orders/status", {
                orderId,
                status: newStatus
            }, { headers: { token } });

            if (response.data.success) {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === orderId ? { ...order, status: newStatus } : order
                    )
                );

                if (newStatus === "Delivered") {
                    await updateStatus("active");
                }
            }
        } catch (error) {
            toast.error("Error updating order status");
        }
    };

    const removeOrder = (orderId) => {
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
    };
    
    

    useEffect(() => {
        if (token) {
            fetchAssignedOrders();
            fetchStatus();
        }
    }, [token]); 

    return (
        <div className="dashboard-container">
            <h2>Delivery Man Dashboard</h2>
            <div className="status-section">
                <h3>Current Status: {status}</h3>
                <button onClick={() => updateStatus("active")}>Active</button>
                <button onClick={() => updateStatus("allocated")}>Allocated</button>
                <button onClick={() => updateStatus("inactive")}>Inactive</button>
            </div>

            <h3>Assigned Orders</h3>
            <div className="orders-container">
                {orders.length === 0 ? <p>No assigned orders</p> : orders.map((order, index) => (
                    <div key={index} className="order-item">
                        <img src={assets.parcel_icon} alt="Parcel Icon" />
                        <div>
                            <p className="order-item-food">
                                {order.items.map((item, idx) => (
                                    idx === order.items.length - 1 ?
                                        item.name + " x " + item.quantity :
                                        item.name + " x " + item.quantity + " , "
                                ))}
                            </p>
                            <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
                            <div className='order-item-address'>
                                <p>{order.address.street + " , "}</p>
                                <p>{order.address.city + " , " + order.address.zipcode + " , " + order.address.district + " , " + order.address.division}</p>
                            </div>
                            <p className='order-item-phone'>{order.address.phone}</p>
                        </div>
                        <p>Item: {order.items.length}</p>
                        <p>Amount: {order.amount}</p>

                        <select onChange={(event) => statushandler(event, order._id)} disabled={order.status === "Delivered"} value={order.status}>
                            <option value="Food Processing" selected={order.status === "Food Processing"}>Food Processing</option>
                            <option value="Out for delivery" selected={order.status === "On delivery"}>On delivery</option>
                            <option value="Delivered" selected={order.status === "Delivered"}>Delivered</option>
                        </select>

                        {order.status === "Delivered" && (
                            <button onClick={() => removeOrder(order._id)}>Remove</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeliveryManDashboard;
