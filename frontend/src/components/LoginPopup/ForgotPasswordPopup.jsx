// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { StoreContext } from "../../context/StoreContext";
// import "./ForgotPasswordPopup.css";

// const ForgotPasswordPopup = ({ setShowForgotPassword, setShowLogin }) => {
//     const { url } = useContext(StoreContext);
//     const [email, setEmail] = useState("");
//     const [otp, setOtp] = useState("");
//     const [newPassword, setNewPassword] = useState("");
//     const [step, setStep] = useState(1);

//     const sendOtp = async () => {
//         const response = await axios.post(`${url}/api/user/forgot-password`, { email });
//         if (response.data.success) {
//             setStep(2);
//             alert("OTP Sent!");
//         } else {
//             alert(response.data.message);
//         }
//     };

//     const verifyOtp = async () => {
//         const response = await axios.post(`${url}/api/user/verify-otp`, { email, otp, newPassword });
//         if (response.data.success) {
//             alert("Password reset successful!");
//             setShowForgotPassword(false);
//             setShowLogin(true);
//         } else {
//             alert(response.data.message);
//         }
//     };

//     return (
//         <div className="forgot-password-popup">
//             {step === 1 ? (
//                 <div>
//                     <h2>Reset Password</h2>
//                     <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                     <button onClick={sendOtp}>Send OTP</button>
//                 </div>
//             ) : (
//                 <div>
//                     <h2>Enter OTP</h2>
//                     <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
//                     <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
//                     <button onClick={verifyOtp}>Reset Password</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ForgotPasswordPopup;

import React, { useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./ForgotPasswordPopup.css";
import { assets } from "../../assets/assets"; 

const ForgotPasswordPopup = ({ setShowForgotPassword, setShowLogin }) => {
    const { url } = useContext(StoreContext);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    // const navigate = useNavigate(); // Navigation setup

    const sendOtp = async () => {
        const response = await axios.post(`${url}/api/user/forgot-password`, { email });
        if (response.data.success) {
            setStep(2);
            alert("OTP Sent!");
        } else {
            alert(response.data.message);
        }
    };

    const verifyOtp = async () => {
        const response = await axios.post(`${url}/api/user/verify-otp`, { email, otp, newPassword });
        if (response.data.success) {
            alert("Password reset successful!");
            setShowForgotPassword(false);
            setShowLogin(true);
        } else {
            alert(response.data.message);
        }
    };

    const closePopup = () => {
        setShowLogin(false);
    };

    return (
        <div className="forgot-password-overlay">
            <div className="forgot-password-popup">
                <img src={assets.cross_icon} alt="Close" className="close-icon" onClick={closePopup} />
                {step === 1 ? (
                    <div>
                        <h2>Reset Password</h2>
                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <button onClick={sendOtp}>Send OTP</button>
                    </div>
                ) : (
                    <div>
                        <h2>Enter OTP</h2>
                        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        <button onClick={verifyOtp}>Reset Password</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPopup;
