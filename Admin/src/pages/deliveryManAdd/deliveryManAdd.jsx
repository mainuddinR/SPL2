// deliveryManAdd.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './deliveryManAdd.css';
import { useEffect } from 'react';

const DeliveryManAdd = ({ url }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/user/register`, {
        ...formData,
        role: 'delivery_man'
      });
      toast.success('Delivery Man Registered Successfully!');
      setFormData({ name: '', email: '', password: '', phone: '', address: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration Failed');
    }
  };
//   useEffect(()=>{
//   storeUserInfo();
// },[])

  return (
    <div className="delivery-man-add">
      <h2>Register Delivery Man</h2>
      <br /> <br />
      <form onSubmit={handleSubmit} className="delivery-man-form">
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required/>
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default DeliveryManAdd;
