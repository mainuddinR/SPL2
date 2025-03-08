import React, { useState } from "react";
import axios from "axios";
import "./paymentHistory.css";

const PaymentHistory = ({url}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axios.get(
        `${url}/api/payment/record?startDate=${startDate}&endDate=${endDate}`
      );
      if(response.data.success){
        setPayments(response.data.data);
      }
    } catch (err) {
        console.log(error);
      setError("Failed to fetch payment records.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>Payment Records</h2>
      <div className="date-filter">
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
            <button onClick={fetchPayments} disabled={loading}>
            {loading ? "Searching..." : "Search"}
           </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <table className="payment-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>User Email</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Transaction ID</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.user.name}</td>
                <td>{payment.user.email}</td>
                <td>${payment.amount}</td>
                <td>{payment.paymentMethod === "online" ? "Online" : "Cash"}</td>
                <td>
                  {payment.paymentMethod === "online"
                    ? payment.transactionId
                    : "NA"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
