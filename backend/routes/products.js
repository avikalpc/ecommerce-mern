const express = require('express');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all products with filtering, pagination and search
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      rating,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (rating) filter.ratings = { $gte: Number(rating) };
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const products = await Product.find(filter)
      .populate('createdBy', 'name')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar')
      .populate('createdBy', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (Admin only)
router.post('/', [adminAuth, upload.array('images', 5)], [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').isNumeric().withMessage('Stock must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, comparePrice, category, subcategory, brand, stock, specifications, tags, isFeatured } = req.body;

    // Upload images to Cloudinary
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'ecommerce/products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file.buffer);
        });
        
        images.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      comparePrice: comparePrice ? Number(comparePrice) : undefined,
      category,
      subcategory,
      brand,
      stock: Number(stock),
      images,
      specifications: specifications ? JSON.parse(specifications) : [],
      tags: tags ? JSON.parse(tags) : [],
      isFeatured: isFeatured === 'true',
      createdBy: req.userId
    });

    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Admin only)
router.put('/:id', [adminAuth, upload.array('images', 5)], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updates = req.body;
    
    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'ecommerce/products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file.buffer);
        });
        
        newImages.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
      updates.images = [...product.images, ...newImages];
    }

    Object.keys(updates).forEach(key => {
      if (key !== 'images' || req.files?.length > 0) {
        product[key] = updates[key];
      }
    });

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add product review
router.post('/:id/reviews', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Comment is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.userId
    );

    if (existingReview) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      user: req.userId,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured products
router.get('/featured/products', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .limit(8)
      .sort({ createdAt: -1 });
    
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
