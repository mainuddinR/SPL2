import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [role, setRole] = useState('');
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [userlist, setUserList] = useState([]);
    const [userData,setUserData] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);


    const url = "http://localhost:4000";

    // const addToCart = async (itemId) => {
    //     if (!cartItems[itemId]) {
    //         setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    //     } else {
    //         setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    //     }
    //     if (token) {
    //         await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    //     }
    // };

    // const removeFromCart = async (itemId) => {
    //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    //     if (token) {
    //         await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    //     }
    // };

    // const getTotalCartAmount = () => {
    //     let totalAmount = 0;
    //     for (const item in cartItems) {
    //         if (cartItems[item] > 0) {
    //             let itemInfo = food_list.find((product) => product._id === item);
    //             totalAmount += itemInfo.price * cartItems[item];
    //         }
    //     }
    //     return totalAmount;
    // };


    const fetchCartData = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${url}/api/cart/${userData?._id}`, { headers: { token } });
            if (response.status === 200) {
                setCartItems(response.data.items);
                setTotalPrice(response.data.totalPrice);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };
    

    const addToCart = async (itemId, quantity = 1) => {
        if (!token) {
            console.log("User not authenticated");
            return;
        }
        try {
            const response = await axios.post(
                `${url}/api/cart/add`,
                { userId: userData?._id, itemId, quantity },
                { headers: { token } }
            );
            if (response.status === 200) {
                setCartItems(response.data.items);
                setTotalPrice(response.data.totalPrice);
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };
    

    const removeFromCart = async (itemId) => {
        if (!token) return;
        try {
            const response = await axios.post(
                `${url}/api/cart/remove`,
                { userId: userData?._id, itemId },
                { headers: { token } }
            );
            if (response.status === 200) {
                setCartItems(response.data.items);
                setTotalPrice(response.data.totalPrice);
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };
    

    const updateCartItemQuantity = async (itemId, quantity) => {
        if (!token) return;
        try {
            const response = await axios.post(
                `${url}/api/cart/update`,
                { userId: userData?._id, itemId, quantity },
                { headers: { token } }
            );
            if (response.status === 200) {
                setCartItems(response.data.items);
                setTotalPrice(response.data.totalPrice);
            }
        } catch (error) {
            console.error("Error updating cart item:", error);
        }
    };

    // Get total cart amount
    const getTotalCartAmount = () => {
        return totalPrice;
    };
    


    const fetchUserList = async () => {
        try {
            const response = await axios.get(`${url}/api/user/userlist`);
            if (response.data.success) {
                setUserList(response.data.data);
            } else {
                console.log("Failed to fetch user list");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUserList();
    }, []);

    const fetchItemList = async () => {
        const response = await axios.get(`${url}/api/item/list`);
        setFoodList(response.data.data);
    };

    useEffect(() => {
        async function loadData() {
            await fetchItemList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
            }
        }
        loadData();
    }, []);

    //cart token
    useEffect(() => {
        async function loadData() {
            await fetchCartData();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
            }
        }
        loadData();
    }, [token, userData]);

    // useEffect(()=>{
    //     console.log(userData);
    // },[userData])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        getTotalCartAmount,
        url,
        token,
        setToken,
        userlist,
        setRole,
        role,
        setUserData,
        userData
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
