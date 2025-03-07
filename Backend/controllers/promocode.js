import promoCodeModel from "../models/promocodeModel.js";


const createPromocode = async (req, res) => {
  try {
    const { code, discount, category, expiryDate } = req.body;
    const newPromo = new promoCodeModel({ code, discount, category, expiryDate });
    await newPromo.save();
    res.status(201).json({ message: "Promo Code Created", promo: newPromo });
  } catch (error) {
    res.status(500).json({ message: "Error creating promo code", error });
  }
};

const getPromoCode = async (req, res) => {
  try {
    const promos = await promoCodeModel.find();
    res.status(200).json(promos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching promo codes", error });
  }
};

export {getPromoCode,createPromocode};