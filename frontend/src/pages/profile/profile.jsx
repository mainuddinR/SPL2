import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './profile.css';

const Profile = () => {

  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState({
    name: '',
    phone: '',
    address: ''
});
  const { token, setToken, userlist, currentUser,url } = useContext(StoreContext);  // Access token from context

  let userID;
  let cUser;
  userlist.forEach(element => {
    if (currentUser === element.email) {
      userID = element._id;
      cUser = element;
    }
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    console.log(cUser);

    if(user.name==='') user.name=cUser.name;
    if(user.phone==='') user.phone=cUser.phone;
    if(user.address==='') user.address=cUser.address;
    console.log('something');
    try {
      const response = await axios.post(
        `${url}/api/user/profile_update`,
        {user},
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        console.log(`${section} updated successfully!`);
      } else {
        console.log("Failed to update the profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-section">
        <label type="name">Name</label>
        <input
          type="text"
          name="name"
          placeholder={cUser.name}
          onChange={handleChange}
        />

        <label>Mobile Number</label>
        <input
          type="text"
          name="phone"
          placeholder={cUser.phone}
          onChange={handleChange}
        />

        <label>Address</label>
        <input
          type="text"
          name="address"
          placeholder={cUser.address}
          onChange={handleChange}
        />

        <button onClick={handleSave}>Save</button>
      </div>

      <div className="profile-section">
        <h3>Email</h3>
        <input
          type="email"
          name="email"
          value={cUser.email}
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
