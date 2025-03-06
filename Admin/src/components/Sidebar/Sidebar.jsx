import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <div className="sidebar-options">
            <NavLink to='/add' className="sidebar-option">
                <img src={assets.add_icon} alt="" />
                <p>Add Items</p>
            </NavLink>
            <NavLink to='/list' className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>List Items</p>
            </NavLink>
            <NavLink to='/orders' className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>Orders</p>
            </NavLink>
            <NavLink to='/deliveryManRegister' className="sidebar-option">
                <img src={assets.profile_image} alt="" width="40px" height="35px" />
                <p>Delivery Man Register</p>
            </NavLink>
            <NavLink to='/customer-feedback' className='sidebar-option'>
                <img src={assets.feedback} alt="" width="40px" height="35px"/>
                <p>Customer Feedback</p>
            </NavLink>
        </div>
      
    </div>
  )
}

export default Sidebar
