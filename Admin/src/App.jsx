import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes,Route } from 'react-router-dom'
import Add from './pages/Add/add'
import List from './pages/List/List'
import Orders from './pages/Order/Orders'
import DeliveryManAdd from './pages/deliveryManAdd/deliveryManAdd'
import { ToastContainer } from 'react-toastify';
import CustomerFeedback from './pages/CustomerFeedback/CustomerFeedback'
import Promocode from './pages/Promocode/Promocode'
import PaymentHistory from './pages/paymentHistory/paymentHistory'


const App = () => {

  const url="http://localhost:4000";

  return (
    <div>
      <ToastContainer/>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add url={url}/>} />
          <Route path="/list" element={<List  url={url}/>} />
          <Route path="/orders" element={<Orders url={url}/>} />
          <Route path="/deliveryManRegister" element={<DeliveryManAdd url={url}/>}/>
          <Route path='/customer-feedback' element={<CustomerFeedback url={url}/>}/>
          <Route path='/promocode-create' element={<Promocode/>}/>
          <Route path='/payment-history' element={<PaymentHistory url={url}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
