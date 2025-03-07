import React, { useContext, useState,useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Navbar = ({ setShowLogin}) => {

  const [menu, setMenu] = useState("home");
  const {setToken,setUserData,role,setRole, getTotalCartAmount, token,url} = useContext(StoreContext);
  const navigate = useNavigate();

  //new user fatch
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const response = await axios.get(`${url}/api/user/profile`, {
            headers: { token }
          });
          setUserData(response.data.data);  // Set the user's profile in the context
          setRole(response.data.data.role);
          //console.log(response.data.data.role);
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
  

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }
  const toggleDropdown=()=> {
    const menu = document.getElementById('dropdownMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}
  //const profileButton=document.getElementById('dropdownMenu');

  return (
    <div className='navbar'>
      {/* <img src={assets.delivery_logo} alt="" className='' /> */}
      <Link to='/'><img src={assets.FoodLogo} alt="" className='logo' /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile-app</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</a>

      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search_icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? <button onClick={() => setShowLogin(true)}>sign in</button> :
        <div className="dropdown">
          <div className="dropdown-toggle" onClick={toggleDropdown}>
            <span> <img src={assets.profile_icon} alt="" /></span>
          </div>
          <div className="dropdown-menu" id="dropdownMenu">
            <a href="/myorders"><span><img src={assets.order_icon} width="25px" height="25px" alt="" /></span>Orders</a>
            <a href="/past-order"><span>📋</span> Orders & reordering</a>
            <Link to="/profile"><span>👤</span> Profile</Link>
            <a href="/vouchers"><span>🎫</span> Vouchers</a>
            <a href="#"><span>❓</span> Help center</a>
            {/* <a href='../../../admin/main.jsx'><span>⚙️</span>Admin Page</a> */}
            <span className={role==='customer'? 'active':''}>
              <span className={role==='delivery_man'? 'active':''}>
                <a href='http://localhost:5173/add' target='_blank'><span>⚙️</span>Admin Page</a>
              </span>
              <span className={role==='admin'? 'active':''}>
                <a href="/dashboard"><span><img src={assets.courier} alt="" width="25px" height="25px" /></span>Dashboard</a>
             </span>
            </span>
            <a onClick={logout}><span>🚪</span> Logout</a>
          </div>
        </div>}

        {/* // :<div className='navbar-profile'>
        //     <img src={assets.profile_icon} alt="" />
        //     <ul className="nav-profile-dropdown">
        //       <li><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
        //       <hr />
        //       <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
        //     </ul>
        //   </div> */}
      </div>
    </div>
  )
}

export default Navbar
