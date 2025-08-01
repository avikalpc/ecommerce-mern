










const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update personal information
router.put('/personal-info', auth, [
  body('name').notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phoneNumber').optional().isMobilePhone().withMessage('Please provide a valid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phoneNumber } = req.body;

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      email: email.toLowerCase(), 
      _id: { $ne: req.userId } 
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { 
        name: name.trim(),
        email: email.toLowerCase(),
        phoneNumber: phoneNumber?.trim() || '',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      success: true, 
      message: 'Personal information updated successfully',
      user 
    });
  } catch (error) {
    console.error('Update personal info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match new password');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    user.updatedAt = new Date();
    await user.save();

    res.json({ 
      success: true, 
      message: 'Password updated successfully' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user addresses
router.get('/addresses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('addresses');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, addresses: user.addresses || [] });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new address
router.post('/addresses', auth, [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('addressLine1').notEmpty().withMessage('Address line 1 is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('zipCode').notEmpty().withMessage('ZIP code is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, addressLine1, addressLine2, city, state, zipCode, country, phone, isDefault } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize addresses array if it doesn't exist
    if (!user.addresses) {
      user.addresses = [];
    }

    // If this is set as default, remove default from other addresses
    if (isDefault) {
      user.addresses.forEach(addr => { addr.isDefault = false; });
    }

    // If no addresses exist and this is the first one, make it default
    const isFirstAddress = user.addresses.length === 0;

    const newAddress = {
      fullName: fullName.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2?.trim() || '',
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      country: country.trim(),
      phone: phone?.trim() || '',
      isDefault: isDefault || isFirstAddress,
      createdAt: new Date()
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ 
      success: true, 
      message: 'Address added successfully',
      address: user.addresses[user.addresses.length - 1]
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update address
router.put('/addresses/:addressId', auth, [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('addressLine1').notEmpty().withMessage('Address line 1 is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('zipCode').notEmpty().withMessage('ZIP code is required'),
  body('country').notEmpty().withMessage('Country is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { addressId } = req.params;
    const { fullName, addressLine1, addressLine2, city, state, zipCode, country, phone, isDefault } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If this is set as default, remove default from other addresses
    if (isDefault) {
      user.addresses.forEach(addr => { 
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false; 
        }
      });
    }

    // Update address
    address.fullName = fullName.trim();
    address.addressLine1 = addressLine1.trim();
    address.addressLine2 = addressLine2?.trim() || '';
    address.city = city.trim();
    address.state = state.trim();
    address.zipCode = zipCode.trim();
    address.country = country.trim();
    address.phone = phone?.trim() || '';
    address.isDefault = isDefault;
    address.updatedAt = new Date();

    await user.save();

    res.json({ 
      success: true, 
      message: 'Address updated successfully',
      address 
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete address
router.delete('/addresses/:addressId', auth, async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const wasDefault = address.isDefault;
    user.addresses.pull(addressId);

    // If deleted address was default and there are other addresses, make the first one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({ 
      success: true, 
      message: 'Address deleted successfully' 
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
