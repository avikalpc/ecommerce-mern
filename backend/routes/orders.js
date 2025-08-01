const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const router = express.Router();


// Create new order (SIMPLIFIED - Remove payment verification)
router.post('/', auth, [
  body('orderItems').isArray().withMessage('Order items must be an array'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderItems, shippingAddress, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    // Verify products and stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
    }

    const order = new Order({
      user: req.userId,
      orderItems,
      shippingAddress,
      paymentInfo: {
        id: `order_${Date.now()}`,
        status: 'pending', // Set as pending instead of completed
        method: 'cash_on_delivery' // Default to COD
      },
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    await order.save();
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});










// Get user orders
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    if (status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = {};
    if (status) filter.orderStatus = status;

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
