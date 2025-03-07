import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'delivery_man'],
        default: 'customer' 
    }
},
    {
        timestamps: true,
        minimize: false
    }  

);

const userModel = mongoose.models.users || mongoose.model("users",userSchema);
export default userModel;