import React, { useState, useContext, useEffect } from "react";
import './Feedback.css'
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const Feedback = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext)
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${url}/api/feedback/submit`,
        { orderId, rating, comments },
        { headers: { token } }
      );
      alert("Feedback submitted successfully");
      navigate("/past-order");
    } catch (error) {
      console.error("Error submitting feedback", error);
    }
  };

//   useEffect(()=>{
//     console.log(orderId);
//   },[])

  return (
    <div>
      <h2>Give Feedback</h2>
      <form onSubmit={handleSubmit}>
        <label>Rating:</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />
        <label>Comments:</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          required
        ></textarea>
        <br />
        <br />
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default Feedback;