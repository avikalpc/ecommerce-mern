

const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'wishlist',
      populate: {
        path: 'product',
        model: 'Product'
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      wishlist: user.wishlist || [],
      count: user.wishlist ? user.wishlist.length : 0
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add product to wishlist
router.post('/add/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize wishlist if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Check if product already in wishlist
    const existingItem = user.wishlist.find(item => 
      item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add to wishlist
    user.wishlist.push({
      product: productId,
      addedAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Product added to wishlist'
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove product from wishlist
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.wishlist) {
      return res.status(400).json({ message: 'Wishlist is empty' });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(item => 
      item.product.toString() !== productId
    );

    await user.save();

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
