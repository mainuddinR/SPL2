import  express  from "express";
import cors from "cors"
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import AdminRouter from "./routes/AdminRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import deliveryManRouter from "./routes/deliveryManRoute.js";
import feedbackRouter from "./routes/feedbackRoute.js";
import promocodeRouter from "./routes/promocodeRoute.js";
import paymentRouter from "./routes/paymentRoute.js";



//app config
const app = express()
const port = 4000 //5173

//for stripe 
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));


//middleware
app.use(express.json())

//for stripe payment 
app.use(express.urlencoded({ extended: true }));

app.use(cors())

//db connection
connectDB();


//api endpoints
app.use("/api/item",AdminRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/orders",orderRouter)
app.use("/api/deliveryMan",deliveryManRouter);
app.use("/api/feedback",feedbackRouter);
app.use("/api/promos",promocodeRouter);
app.use('/api/payment',paymentRouter);



app.get("/",(req,res)=>{
    res.send("API Working")
})


app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})

//mongodb+srv://mainuddin:11223344@cluster0.aa9el.mongodb.net/?