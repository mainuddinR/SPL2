import paymentModel from '../models/paymentModel.js';

const processPayment = async (req, res) => {
  const { orderId, userId, amount, paymentMethod, transactionId } = req.body;

  try {
    const payment = new paymentModel({
      orderId,
      userId,
      amount,
      paymentMethod,
      transactionId
    });

    await payment.save();
    res.status(201).json({ message: 'Payment processed successfully', payment });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error });
  }
};

const verifyPayment = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await paymentModel.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment verified', payment });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error });
  }
};


export { processPayment, verifyPayment };