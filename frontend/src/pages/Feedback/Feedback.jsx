// import React, { useState, useContext, useEffect } from "react";
// import './Feedback.css'
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { StoreContext } from "../../context/StoreContext";

// const Feedback = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const { url, token } = useContext(StoreContext)
//   const [rating, setRating] = useState(5);
//   const [comments, setComments] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         `${url}/api/feedback/submit`,
//         { orderId, rating, comments },
//         { headers: { token } }
//       );
//       alert("Feedback submitted successfully");
//       navigate("/past-order");
//     } catch (error) {
//       console.error("Error submitting feedback", error);
//     }
//   };

// //   useEffect(()=>{
// //     console.log(orderId);
// //   },[])

//   return (
//     <div>
//       <h2>Give Feedback</h2>
//       <form onSubmit={handleSubmit}>
//         <label>Rating:</label>
//         <input
//           type="number"
//           min="1"
//           max="5"
//           value={rating}
//           onChange={(e) => setRating(e.target.value)}
//           required
//         />
//         <label>Comments:</label>
//         <textarea
//           value={comments}
//           onChange={(e) => setComments(e.target.value)}
//           required
//         ></textarea>
//         <br />
//         <br />
//         <button type="submit">Submit Feedback</button>
//       </form>
//     </div>
//   );
// };

// export default Feedback;

import React, { useState, useContext } from "react";
import "./Feedback.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { FaStar } from "react-icons/fa"; // FontAwesome Star Icons

const Feedback = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(null);
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

  return (
    <div className="feedback-container">
      <h2>Give Your Feedback</h2>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <label>Rating:</label>
        <div className="star-rating">
          {[...Array(5)].map((_, index) => {
            const currentRating = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={currentRating}
                  onClick={() => setRating(currentRating)}
                  style={{ display: "none" }} // Hide radio buttons
                />
                <FaStar
                  className="star"
                  size={30}
                  color={currentRating <= (hover || rating) ? "#ff6347" : "#ccc"}
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setRating(currentRating)} // Clickable star rating
                />
              </label>
            );
          })}
        </div>
        <label>Comments:</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          required
        ></textarea>
        <button className="submit-btn" type="submit">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default Feedback;
