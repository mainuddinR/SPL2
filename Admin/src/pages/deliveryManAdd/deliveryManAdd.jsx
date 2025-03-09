import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './deliveryManAdd.css';

const DeliveryManAdd = ({ url }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: '', role: 'delivery_man'
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(300);
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [showList, setShowList] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    try {
      await axios.post(`${url}/api/user/sendOtpForRegister`, formData);
      toast.success('OTP Sent Successfully!');
      setOtpSent(true);
      startTimer();
    } catch (error) {
      console.log(error);
      toast.error('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`${url}/api/user/register`, { email: formData.email, otp });
      if (response.data.success) {
        toast.success('Delivery Man Registered Successfully!');
        setFormData({ name: '', email: '', password: '', phone: '', address: '' });
        setOtp('');
        setOtpSent(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('OTP Verification Failed');
    }
  };

  const startTimer = () => {
    setTimer(300);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setOtpSent(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fetchDeliveryMen = async () => {
    try {
      const response = await axios.get(`${url}/api/deliveryMan/get`);
      setDeliveryMen(response.data);
      setShowList(true);
    } catch (error) {
      console.log("Fetch: ", error);
    }
  };

  return (
    <div className="delivery-man-add">
      <h2>Register Delivery Man</h2>
      <form className="delivery-man-form">
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        {!otpSent ? (
          <button type="button" onClick={handleSendOtp}>Registration</button>
        ) : (
          <>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <p className="timer">
              Time Left: {`${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`}s
            </p>
            <button type="button" onClick={handleVerifyOtp}>Verify Email</button>
          </>
        )}
      </form>
      <button className="show-list-btn" onClick={fetchDeliveryMen}>Show Delivery Men</button>

      {showList && (
        <div className="delivery-men-list">
          <h3>Delivery Men List</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            {/* <tbody>
              {deliveryMen.map((man) => (
                <tr key={man._id}>
                  <td>{man.user.name}</td>
                  <td>{man.user.email}</td>
                  <td>{man.status}</td>
                </tr>
              ))}
            </tbody> */}
            <tbody>
              {deliveryMen.filter(man => man.user).map((man) => (
                <tr key={man._id}>
                  <td>{man.user.name}</td>
                  <td>{man.user.email}</td>
                  <td>{man.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeliveryManAdd;
