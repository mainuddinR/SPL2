import React, { useContext, useState, useEffect } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"

const LoginPopup = ({setShowLogin}) => {

    const {url,setToken,setRole,token} = useContext(StoreContext);
    const [currState,setCurrState] = useState("Login");
    const [data,setData] = useState({
      name:"",
      email:"",
      password:""
    })

    //new user fatch

    const [userData,setUserData] = useState(null);

    const fetchUserProfile = async () => {
      if (token) {
        try {
          const response = await axios.get(`${url}/api/user/profile`, {
            headers: { token }
          });
          setUserData(response.data.data);  // Set the user's profile in the context
          setRole(response.data.data.role);
          console.log(response.data.data.role);
        } catch (error) {
          console.error("Error fetching user profile", error);
        }
      }
    };
  


    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data =>({...data,[name]:value}))
        // if(name==='email'){
        //   setCurrentUser(value);
        // }
    }

    const onLogin = async (event) => {
        event.preventDefault()
        let newUrl = url;
        if(currState==="Login"){
          newUrl += "/api/user/login"
        }
        else{
          newUrl += "/api/user/register"
        }

        const response = await axios.post(newUrl,data);

        if(response.data.success){
            setToken(response.data.token);
            localStorage.setItem("token",response.data.token);
            setShowLogin(false);
        }
        else{
          alert(response.data.message)
        }

        
    }


    //setRole(userData.role);

    //end
    

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
            {currState==="Login"?<></>:<input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required/>
            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
        </div>
        <button type='submit'>{currState==="Sign Up"?"Create account":"Login"}</button>
        <div className="login-popup-condition">
            <input type="checkbox"required/>
            <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState==="Login"?
        <p>Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click here</span> </p>
        :<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
