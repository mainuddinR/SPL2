import { createContext, useEffect, useState } from "react";
import axios from 'axios'
//import { food_list } from "../assets/assets";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    //
    const [currentUser,setCurrentUser]=useState('');

    const url = "http://localhost:4000";
    const [token,setToken] = useState("");
    const[food_list,setFoodList] = useState([]);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}});
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});
        }
    }



    // useEffect(()=>{
    //     console.log(cartItems);
    // },[cartItems])

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }
    //user List
    const [userlist,setUserList] = useState([]);
    const fetchUserList = async() =>{
        try{
            const response = await axios.get(`${url}/api/user/userlist`);
            if(response.data.success){
                setUserList(response.data.data);
            }
            else{
                console.log("userList not store");
            }   
        }
        catch(error){
            console.log(error);
        }  
    }
    useEffect(()=>{
        fetchUserList();
    })
    //console.log(userlist);
    // userlist.forEach(element => {
    
    //     console.log(element._id)
    //   });


    const fetchItemList = async () => {
        const response = await axios.get(`${url}/api/item/list`);
        setFoodList(response.data.data);
    }

//new
// const [userProfile, setUserProfile] = useState(null); 

//     const fetchUserProfile = async () => {
//         if (token) {
//             try {
//                 const response = await axios.get(`${url}/api/user/profile`, {
//                     headers: { token }
//                 });
//                 setUserProfile(response.data.data);  // Set the user's profile in the context
//             } catch (error) {
//                 console.error("Error fetching user profile", error);
//             }
//         }
//     };

//     useEffect(() => {
//         if (token) {
//             fetchUserProfile();  // Fetch the user profile when the token is set
//             //console.log(userProfile);
//         }
//     }, [token]);

    //end

    useEffect(()=>{
       
        async function loadData(){
            await fetchItemList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        //userProfile,
        userlist,
        setCurrentUser,
        currentUser

    }
    //console.log(currentUser);

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;