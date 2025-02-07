import  express  from "express";
import cartController from './controllers/cartController.js'

const router = express.Router();
const cartController = require('./cartController');

router.post('/add', cartController.addItem);
router.post('/remove', cartController.removeItem);
router.post('/update', cartController.updateQuantity);
router.get('/:userId', cartController.getCart);

export default router;