import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  category: { type: String, required: true },
  expiryDate: { type: Date, required: true }
});

const promoCodeModel = mongoose.models.PromoCode ||mongoose.model("PromoCode", promoCodeSchema);

export default promoCodeModel;
