// import React, { useContext, useState } from 'react';
// import './LoginPopup.css';
// import { assets } from '../../assets/assets';
// import { StoreContext } from '../../context/StoreContext';
// import axios from "axios";
// import ForgotPasswordPopup from './ForgotPasswordPopup';

// const LoginPopup = ({ setShowLogin }) => {
//     const { url, setToken } = useContext(StoreContext);
//     const [currState, setCurrState] = useState("Login");
//     const [showForgotPassword, setShowForgotPassword] = useState(false);
//     const [data, setData] = useState({ name: "", email: "", password: "" });

//     const onChangeHandler = (event) => {
//         const { name, value } = event.target;
//         setData(prev => ({ ...prev, [name]: value }));
//     };

//     const onLogin = async (event) => {
//         event.preventDefault();
//         let newUrl = url + (currState === "Login" ? "/api/user/login" : "/api/user/register");

//         const response = await axios.post(newUrl, data);
//         if (response.data.success) {
//             setToken(response.data.token);
//             localStorage.setItem("token", response.data.token);
//             setShowLogin(false);
//         } else {
//             alert(response.data.message);
//         }
//     };

//     return (
//         <>
//             {!showForgotPassword ? (
//                 <div className='login-popup'>
//                     <form onSubmit={onLogin} className="login-popup-container">
//                         <div className="login-popup-title">
//                             <h2>{currState}</h2>
//                             <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
//                         </div>
//                         <div className="login-popup-inputs">
//                             {currState === "Sign Up" && <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
//                             <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
//                             <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
//                         </div>
//                         <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>
//                         <div className="login-popup-condition">
//                             <input type="checkbox" required />
//                             <p>By continuing, I agree to the terms of use & privacy policy.</p>
//                         </div>
//                         {currState === "Login" ? (
//                             <>
//                                 <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
//                                 <p><span onClick={() => setShowForgotPassword(true)} style={{ color: "blue", cursor: "pointer" }}>Reset Password</span></p>
//                             </>
//                         ) : (
//                             <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
//                         )}
//                     </form>
//                 </div>
//             ) : (
//                 <ForgotPasswordPopup setShowForgotPassword={setShowForgotPassword} setShowLogin={setShowLogin} />
//             )}
//         </>
//     );
// };

// export default LoginPopup;


import React, { useContext, useState, useEffect } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";
import ForgotPasswordPopup from './ForgotPasswordPopup';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [data, setData] = useState({ name: "", email: "", password: "", otp: "" });
    const [otpSent, setOtpSent] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); 

    useEffect(() => {
        if (otpSent && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpSent, timeLeft]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const onSignUp = async (event) => {
        event.preventDefault();
        const response = await axios.post(url + "/api/user/sendOtpForRegister", data);
        if (response.data.success) {
            setOtpSent(true);
        } else {
            alert(response.data.message);
        }
    };

    const onVerifyOtp = async (event) => {
        event.preventDefault();
        const response = await axios.post(url + "/api/user/register", { email: data.email, otp: data.otp });
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false);
        } else {
            alert(response.data.message);
        }
    };

    const onLogin = async (event) => {
        event.preventDefault();
        const response = await axios.post(url + "/api/user/login", data);
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false);
        } else {
            alert(response.data.message);
        }
    };

    return (
        <>
            {!showForgotPassword ? (
                <div className='login-popup'>
                    <form onSubmit={currState === "Login" ? onLogin : (otpSent ? onVerifyOtp : onSignUp)} className="login-popup-container">
                        <div className="login-popup-title">
                            <h2>{currState}</h2>
                            <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                        </div>
                        <div className="login-popup-inputs">
                            {currState === "Sign Up" && !otpSent && (
                                <>
                                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
                                </>
                            )}
                            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                            {otpSent && (
                                <>
                                    <input name='otp' onChange={onChangeHandler} value={data.otp} type="text" placeholder='Enter OTP' required />
                                    <p>OTP expires in: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</p>
                                </>
                            )}
                        </div>
                        <button type='submit'>{otpSent ? "Verify OTP" : (currState === "Sign Up" ? "Create account" : "Login")}</button>
                        <div className="login-popup-condition">
                            <input type="checkbox" required />
                            <p>By continuing, I agree to the terms of use & privacy policy.</p>
                        </div>
                        {currState === "Login" ? (
                            <>
                                <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                                <p><span onClick={() => setShowForgotPassword(true)} style={{ color: "blue", cursor: "pointer" }}>Reset Password</span></p>
                            </>
                        ) : (
                            <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                        )}
                    </form>
                </div>
            ) : (
                <ForgotPasswordPopup setShowForgotPassword={setShowForgotPassword} setShowLogin={setShowLogin} />
            )}
        </>
    );
};

export default LoginPopup;
