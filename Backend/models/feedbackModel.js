import mongoose from 'mongoose';
const feedbackSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: "orders", required: true },
      rating: { type: Number, min: 1, max: 5, required: true },
      comments: { type: String, required: true },
    },
    { timestamps: true }
  );
  
  const feedbackModel=mongoose.models.Feedback || mongoose.model('Feedback',feedbackSchema);
  export default feedbackModel;
  