import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img id="footer-logo" src={assets.FoodLogo} alt="" />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit ducimus earum praesentium velit, architecto quae distinctio ea numquam, minima illo deleniti, saepe fugiat cumque neque! Vero veritatis, animi omnis fugit rerum expedita recusandae sunt in fugiat repellendus molestiae deserunt ab!</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>

            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+8801788******</li>
                    <li>foodDelivery@gmail.com</li>
                </ul>
            </div>
        </div>
        <hr />
        <p className='footer-copyright'>Copyright 2025 &copy; Fooddelivey.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
