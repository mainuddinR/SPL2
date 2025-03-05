import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './DeliveryManDashboard.css'

const DeliveryManDashboard = ({ url, loggedInUserId }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchAssignedOrders();
    }, []);

    const fetchAssignedOrders = async () => {
        try {
            const response = await axios.get(url + "/api/deliveryMan/orders", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error("Error fetching orders");
            }
        } catch (error) {
            toast.error("Error fetching orders");
        }
    };

    return (
        <div>
            <h2>Assigned Orders</h2>
            {orders.map(order => (
                <div key={order._id}>
                    <p>Order ID: {order._id}</p>
                    <p>Status: {order.status}</p>
                    <button onClick={() => statushandler("Out for delivery", order._id)}>Out for delivery</button>
                    <button onClick={() => statushandler("Delivered", order._id)}>Delivered</button>
                </div>
            ))}
        </div>
    );
};

export default DeliveryManDashboard;
