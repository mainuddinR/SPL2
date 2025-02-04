import  express  from "express";
import cors from "cors"
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import AdminRouter from "./routes/AdminRoutes.js";



//app config
const app = express()
const port = 4000 //5173

//middleware
app.use(express.json())
app.use(cors())

//db connection
connectDB();


//api endpoints
app.use("/api/item",AdminRouter)
app.use("/images",express.static('uploads'))

//api endpoints
app.use("/api/user",userRouter)


app.get("/",(req,res)=>{
    res.send("API Working")
})


app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})

//mongodb+srv://mainuddin:11223344@cluster0.aa9el.mongodb.net/?