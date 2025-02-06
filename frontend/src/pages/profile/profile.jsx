import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './profile.css';
import { StoreContext } from '../../context/StoreContext';
import { getUserIdFromToken } from '../../middleware/auth'; // Assuming the function is in 'authUtils.js'

const Profile = () => {
  const { url, token } = useContext(StoreContext);
  const [user, setUser] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  });

  const userId = getUserIdFromToken(); // Get the userId from the decoded JWT token

  // Profile data fetch
  const fetchProfile = async () => {
    if (userId) {
      try {
        // Make an API request to fetch the user profile data
        const response = await axios.get(`${url}/api/user/profile/${userId}`, {
          headers: { token: localStorage.getItem('token') } // Use the token for authentication
        });

        // If the response is successful, update the state with the user's data
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  };

  // Call fetchProfile once the component is mounted or when userId changes
  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  // Handle input field changes
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle saving profile changes
  const handleSave = async (section) => {
    try {
      const response = await axios.post(
        `${url}/api/user/profile`,
        { ...user },
        {
          headers: { token: localStorage.getItem('token') },
        }
      );
      if (response.data.success) {
        alert(`${section} updated successfully!`);
      } else {
        alert("Failed to update the profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
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
          value={user.phone || ''} // Handle empty or undefined phone
          onChange={handleChange}
        />

        <label>Address</label>
        <input
          type="text"
          name="address"
          value={user.address || ''} // Handle empty or undefined address
          onChange={handleChange}
        />

        <button onClick={() => handleSave('Profile')}>Save</button>
      </div>

      <div className="profile-section">
        <h3>Email</h3>
        <input
          type="email"
          name="email"
          value={user.email}
          readOnly
        />
        <button disabled>Verified</button>
      </div>

      <div className="profile-section">
        <h3>Password</h3>
        <input
          type="password"
          placeholder="Current password"
          name="currentPassword"
        />
        <input
          type="password"
          placeholder="New password"
          name="newPassword"
        />
        <button onClick={() => handleSave('Password')}>Save</button>
      </div>
    </div>
  );
};

export default Profile;
