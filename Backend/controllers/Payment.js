import paymentModel from '../models/paymentModel.js';
import orderModel from '../models/orderModel.js';
import stripe from 'stripe';

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

const stripeWebhook = async (req, res) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = req.headers["stripe-signature"];

    if (!sig) {
        console.error("Missing Stripe Signature");
        return res.status(400).json({ message: "Missing Stripe Signature" });
    }

    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("Webhook verified successfully!");
    } catch (err) {
        console.error("Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.client_reference_id;
        const paymentIntentId = session.payment_intent;

        if (!orderId || !paymentIntentId) {
            console.error("Missing orderId or paymentIntentId in Webhook");
            return res.status(400).json({ success: false, message: "Invalid Webhook Data" });
        }

        try {
            const order = await orderModel.findById(orderId);
            if (!order) {
                console.error(`Order not found for ID: ${orderId}`);
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            const newPayment = new paymentModel({
                orderId: orderId,
                userId: order.userId,
                amount: session.amount_total / 100,
                paymentMethod: "online",
                transactionId: paymentIntentId
            });

            await newPayment.save();

            order.payment = true;
            await order.save();

            console.log(`✅ Payment successful for order ${orderId}, Transaction ID: ${paymentIntentId}`);
            res.json({ received: true });
        } catch (error) {
            console.error("❌ Error saving payment:", error);
            res.status(500).json({ success: false, message: "Error saving payment" });
        }
    }
};

//router.get("/api/payments", 
const paymentRecord =async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date required" });
      }
  
      const payments = await paymentModel
        .find({
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        })
        .populate("userId", "name email");
  
      const formattedPayments = payments.map((payment) => ({
        _id: payment._id,
        user: {
          name: payment.userId.name,
          email: payment.userId.email,
        },
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.paymentMethod === "online" ? payment.transactionId : "Cash",
      }));
  
      res.json({success:true,data:formattedPayments});
    } catch (error) {
      console.error(error);
      res.json({success:false,message: "Server error" });
    }
  };

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



export { paymentRecord ,processPayment, verifyPayment, stripeWebhook };
