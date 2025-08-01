const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  comparePrice: Number,
  category: {
    type: String,
    required: true
  },
  subcategory: String,
  brand: String,
  images: [{
    public_id: String,
    url: String
  }],
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  ratings: {
    type: Number,
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  // Add this to your Product schema if not already present
reviews: [{
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}],
ratings: {
  type: Number,
  default: 0
},
numOfReviews: {
  type: Number,
  default: 0
},
  specifications: [{
    key: String,
    value: String
  }],
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search functionality
productSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
  brand: 'text'
});

module.exports = mongoose.model('Product', productSchema);
