import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://mainuddin:11223344@cluster0.aa9el.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}