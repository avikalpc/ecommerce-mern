
const mongoose = require('mongoose');

const trackingHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  }
});

const trackingSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    default: () => 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase()
  },
  status: {
    type: String,
    default: 'Order Placed'
  },
  location: {
    type: String,
    default: 'Warehouse'
  },
  estimatedDelivery: {
    type: Date
  },
  trackingHistory: [trackingHistorySchema]
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    }
  }],
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: String
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'stripe'
  },
  paymentInfo: {
    id: String,
    status: String
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'Processing'
  },
  tracking: trackingSchema,
  paidAt: Date,
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
