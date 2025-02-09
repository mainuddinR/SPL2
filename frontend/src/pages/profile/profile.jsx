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
  const { token, userlist, currentUser, url, userProfile } = useContext(StoreContext);  // Access token from context

  let userID;
  let cUser;
  userlist.forEach(element => {
    if (currentUser === element.email) {
      userID = element._id;
      cUser = element;
    }
  });
  //new add for get info
  //const token = localStorage.getItem('token'); // Get token from localStorage

  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:4000/api/user/profile', {
  //         headers: {
  //           token: token, // Sending token in the 'token' header
  //         },
  //       });
  //       setUserData(response.data.data);
  //       console.log(response.data.data);
  //     } catch (error) {
  //       console.error('Error fetching user profile:', error);
  //     }
  //   };

  //   if (token) {
  //     fetchUserProfile();
  //   }
  // }, [token]);

  //const [userProfile, setUserProfile] = useState(null); 

  const fetchUserProfile = async () => {
    if (token) {
      try {
        const response = await axios.get(`${url}/api/user/profile`, {
          headers: { token }
        });
        setUserData(response.data.data);  // Set the user's profile in the context
        //console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching user profile", error);
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();  // Fetch the user profile when the token is set
    }
  }, [token]);

  //end

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
        //localStorage.setItem("token",token);
        // console.log(`${section} updated successfully!`);
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
      {userData ? (
        <div>
          <div className="profile-section">
            <label>Name</label>
            <input
              type="text"
              name="name"
              //placeholder={userData.name}
               value={userData.name}
              onChange={handleChange}
            />

            <label>Mobile Number</label>
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
            />

            <label>Address</label>
            <input
              type="text"
              name="address"
              value={userData.address}
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
