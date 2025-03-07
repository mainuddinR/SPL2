import React, { useState } from "react";
import axios from "axios";
//import PromoForm from "../components/PromoForm";
import "./Promocode.css";

const Promocode = () => {
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    category: "",
    expiryDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/promos/create", formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Failed to create promo code.");
    }
  };

  return (
    <div className="promo-container">
      <h2>Admin - Create Promo Code</h2>
      {/* <PromoForm onSubmit={handlePromoSubmit} /> */}
      <form className="promo-form" onSubmit={handlePromoSubmit}>
      <input type="text" name="code" placeholder="Promo Code" onChange={handleChange} required />
      <input type="number" name="discount" placeholder="Discount (%)" onChange={handleChange} required />
      {/* <input type="text" name="category" placeholder="Category (e.g., Pizza, Burger)" onChange={handleChange} required /> */}
      <select onChange={handleChange} name="category" width="50px" required>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
        </select>
      <input type="date" name="expiryDate" onChange={handleChange} required />
      <button type="submit">Create Promo Code</button>
    </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Promocode;
