



const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Process payment
router.post('/process-payment', auth, async (req, res) => {
  try {
    console.log('Processing payment request...');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { paymentIntentId, orderData } = req.body;

    // Validate required data
    if (!paymentIntentId || !orderData) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required payment data' 
      });
    }

    // Validate order data structure
    if (!orderData.orderItems || !orderData.shippingAddress || !orderData.totalPrice) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid order data structure' 
      });
    }

    // Check if user exists
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Transform order items to ensure product field exists
    const transformedOrderItems = orderData.orderItems.map(item => {
      console.log('Processing item:', item);
      return {
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item.product || item._id || item.id || item.productId
      };
    });

    // Validate that all items have product IDs
    const invalidItems = transformedOrderItems.filter(item => !item.product);
    if (invalidItems.length > 0) {
      console.error('Items missing product ID:', invalidItems);
      return res.status(400).json({
        success: false,
        message: 'Some items are missing product information'
      });
    }

    console.log('Transformed order items:', transformedOrderItems);

    // Create order with tracking
    const order = new Order({
      user: req.userId,
      orderItems: transformedOrderItems,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: 'stripe',
      paymentInfo: {
        id: paymentIntentId,
        status: 'pending'
      },
      itemsPrice: orderData.itemsPrice,
      taxPrice: orderData.taxPrice,
      shippingPrice: orderData.shippingPrice,
      totalPrice: orderData.totalPrice,
      orderStatus: 'Processing',
      tracking: {
        status: 'Order Placed',
        location: 'Warehouse',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        trackingHistory: [
          {
            status: 'Order Placed',
            location: 'Warehouse',
            timestamp: new Date(),
            description: 'Your order has been received and is being processed'
          }
        ]
      }
    });

    const savedOrder = await order.save();
    console.log('Order created successfully:', savedOrder._id);

    res.json({
      success: true,
      order: savedOrder,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to process payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Confirm payment (success/failure simulation)
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { orderId, status, paymentIntentId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status === 'success') {
      order.paymentInfo.status = 'succeeded';
      order.paidAt = new Date();
      order.orderStatus = 'Confirmed';
      
      // Update tracking
      order.tracking.trackingHistory.push({
        status: 'Payment Confirmed',
        location: 'Payment Center',
        timestamp: new Date(),
        description: 'Payment has been confirmed successfully'
      });
      
      order.tracking.trackingHistory.push({
        status: 'Processing',
        location: 'Fulfillment Center',
        timestamp: new Date(),
        description: 'Your order is being prepared for shipment'
      });

      // Update product stock
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } }
        );
      }

      // Clear user's cart
      const user = await User.findById(req.userId);
      if (user) {
        user.cart = [];
        await user.save();
      }

      await order.save();

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        order
      });
    } else {
      order.paymentInfo.status = 'failed';
      order.orderStatus = 'Payment Failed';
      
      order.tracking.trackingHistory.push({
        status: 'Payment Failed',
        location: 'Payment Center',
        timestamp: new Date(),
        description: 'Payment could not be processed. Please try again.'
      });

      await order.save();

      res.json({
        success: false,
        message: 'Payment failed',
        order
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
});

module.exports = router;
