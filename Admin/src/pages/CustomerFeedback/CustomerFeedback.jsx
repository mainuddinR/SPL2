// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./CustomerFeedback.css";

// const CustomerFeedback = ({url}) => {
//   const [feedbacks, setFeedbacks] = useState([]);

//   useEffect(() => {
//     const fetchFeedbacks = async () => {
//       try {
//         const { data } = await axios.get(url+"/api/feedback/gets");
//         setFeedbacks(data);
//       } catch (error) {
//         console.error("Error fetching feedbacks:", error);
//       }
//     };
//     fetchFeedbacks();
//   }, []);

//   return (
//     <div className="feedback-container">
//       <h2>Customer Feedback</h2>
//       <div className="feedback-list">
//         {feedbacks.length === 0 ? (
//           <p>No feedback available.</p>
//         ) : (
//           feedbacks.map((feedback) => (
//             <div key={feedback._id} className="feedback-card">
//               <div className="user-info">
//                 <h3>{feedback.userId.name}</h3>
//                 <p>{feedback.userId.email}</p>
//               </div>
//               <div className="feedback-content">
//                 <p className="rating">⭐ {feedback.rating}/5</p>
//                 <p className="comment">{feedback.comments}</p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomerFeedback;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerFeedback.css";

const CustomerFeedback = ({ url }) => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data } = await axios.get(url + "/api/feedback/gets");

        // ফিডব্যাকগুলো তারিখ অনুযায়ী সাজানো (সর্বশেষ আগে)
        const sortedFeedbacks = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setFeedbacks(sortedFeedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="feedback-container">
      <h2>Customer Feedback</h2>
      <div className="feedback-list">
        {feedbacks.length === 0 ? (
          <p>No feedback available.</p>
        ) : (
          feedbacks.map((feedback) => (
            <div key={feedback._id} className="feedback-card">
              <div className="user-info">
                <h3>{feedback.userId.name}</h3>
                <p>{feedback.userId.email}</p>
              </div>
              <div className="feedback-content">
                <p className="rating">⭐ {feedback.rating}/5</p>
                <p className="comment">{feedback.comments}</p>
                <p className="timestamp">📅 {new Date(feedback.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerFeedback;
