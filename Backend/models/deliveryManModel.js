import mongoose from "mongoose";


const DeliveryManSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "allocated","inactive"],
    default: "inactive",
  },
});

const deliveryManModel = mongoose.models.DeliveryMan||mongoose.model("DeliveryMan", DeliveryManSchema);

export default deliveryManModel;
