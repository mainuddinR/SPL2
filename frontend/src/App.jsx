import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Profile from './pages/profile/profile'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import { ToastContainer } from 'react-toastify';
import DeliveryManDashboard from './pages/Dashboard/DeliveryManDashboard'
import OrderRecord from './pages/RecordOrder/orderRecord'
import Feedback from './pages/Feedback/Feedback'
import Vouchers from './pages/Vouchers/Vouchers'

const App = () => {

  const [showLogin,setShowLogin] = useState(false)

  return (
    <>
    <ToastContainer/>
    {showLogin?<LoginPopup setShowLogin={setShowLogin} />:<></>}
      <div className='app'>
      
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/verify' element={<Verify/>}/>
          <Route path='/myorders' element={<MyOrders/>}/>
          <Route path='/dashboard' element={<DeliveryManDashboard/>}/>
          <Route path='/past-order' element={<OrderRecord/>}/>
          <Route path='/feedback/:orderId' element={<Feedback/>}/>
          <Route path='/vouchers' element={<Vouchers/>}/>
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
