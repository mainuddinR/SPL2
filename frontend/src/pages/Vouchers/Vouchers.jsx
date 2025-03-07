import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Vouchers.css";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const Vouchers = () => {
  const [promos, setPromos] = useState([]);
  const {url} = useContext(StoreContext);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await axios.get(url+"/api/promos/");
        setPromos(response.data);
      } catch (error) {
        console.error("Error fetching promo codes");
      }
    };

    fetchPromos();
  }, []);

  return (
    <div className="promo-container">
      <h2>Available Promo Codes</h2>
      <ul>
        {promos.map((promo) => (
          <li key={promo._id}>
            <strong>{promo.code}</strong> - {promo.discount}% off ({promo.category}) - Expires: {new Date(promo.expiryDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vouchers ;
