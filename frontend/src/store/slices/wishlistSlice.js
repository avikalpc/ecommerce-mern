
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get wishlist
export const getWishlist = createAsyncThunk(
  'wishlist/getWishlist',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('No token found');
      }
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.get(`${API_URL}/wishlist`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

// Add to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('Please login to add items to wishlist');
      }
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.post(`${API_URL}/wishlist/add/${productId}`, {}, config);
      return { ...response.data, productId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('Please login to manage wishlist');
      }
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.delete(`${API_URL}/wishlist/remove/${productId}`, config);
      return { ...response.data, productId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    count: 0,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.count = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get wishlist
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.wishlist || [];
        state.count = action.payload.count || 0;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
        state.count = 0;
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Refresh wishlist after adding
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => 
          item.product._id !== action.payload.productId
        );
        state.count = state.items.length;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
