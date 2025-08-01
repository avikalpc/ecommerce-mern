

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get cart items
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('No token found');
      }
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.get(`${API_URL}/cart`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('Please login to add items to cart');
      }
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.post(`${API_URL}/cart/add`, {
        productId,
        quantity
      }, config);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

// Update cart item
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.put(`${API_URL}/cart/update/${productId}`, {
        quantity
      }, config);
      
      return { ...response.data, productId, quantity };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.delete(`${API_URL}/cart/remove/${productId}`, config);
      return { ...response.data, productId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.delete(`${API_URL}/cart/clear`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update cart item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { productId, quantity } = action.payload;
        const item = state.items.find(item => item.product._id === productId);
        if (item) {
          item.quantity = quantity;
        }
      })
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => 
          item.product._id !== action.payload.productId
        );
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  }
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
