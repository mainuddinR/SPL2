import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js'; 

const updateStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};

const assignDeliveryPersonnel = async (req, res) => {
  const { orderId } = req.params;
  const { deliveryManId } = req.body;

  try {
    // চেক করুন যে ইউজারের role হলো delivery_man
    const deliveryMan = await userModel.findById(deliveryManId);
    if (!deliveryMan || deliveryMan.role !== 'delivery_man') {
      return res.status(400).json({ message: 'Invalid delivery man ID or role' });
    }

    const order = await orderModel.findByIdAndUpdate(orderId, { deliveryManId }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Delivery personnel assigned successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning delivery personnel', error });
  }
};

export { updateStatus, assignDeliveryPersonnel };