import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './profile.css';

const Profile = () => {
  
  const { token,url,userData} = useContext(StoreContext); 

  const [user, setUser] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (userData) {
      setUser({
        name: userData.name || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
    }
  }, [userData]);
  
  const [pass,setPass] = useState({
    currentPassword:'',
    newPassword:''
  })

  const handlePassChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPass((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    if (user.name === '') user.name = userData.name;
    if (user.phone === '') user.phone = userData.phone;
    if (user.address === '') user.address = userData.address;
    try {
      const response = await axios.post(
        `${url}/api/user/profile_update`,
        { user },
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        alert('Information Saved.')
      } else {
        console.log("Failed to update the profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

    const updatePassword = async () => {
      try {
          const response = await axios.post(
              `${url}/api/user/password_change`,
              {
                  currentPassword: pass.currentPassword,
                  newPassword: pass.newPassword
              },
              {
                  headers: {token}
              }
          );
  
          if (response.data.success) {
              alert("Password changed Successfully");
          } else {
              alert(response.data.message);
          }
      } catch (error) {
          console.error("Error updating password:", error.response?.data || error.message);
      }
  };
  

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {userData ? (
        <div>
          <div className="profile-section">
            <label>Name</label>
            <input
              type="text"
              name="name"
               value={user.name}
              onChange={handleChange}
            />

            <label>Mobile Number</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
            />

            <label>Address</label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
            />

            <button onClick={handleSave}>Save</button>
          </div>

          <div className="profile-section">
            <h3>Email</h3>
            <input
              type="email"
              name="email"
              value={userData.email||''}
              readOnly
            />
            <button disabled>Verified</button>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p> 
      )}

      <div className="profile-section">
        <h3>Password</h3>
        <input
          type="password"
          placeholder="Current password"
          name="currentPassword"
          onChange={handlePassChange}
        />
        <input
          type="password"
          placeholder="New password"
          name="newPassword"
          onChange={handlePassChange}
        />
        <button onClick={updatePassword}>Save</button>
      </div>
    </div>
  );
};

export default Profile;
