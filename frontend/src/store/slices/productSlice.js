import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get products with filters
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await axios.get(`${API_URL}/products?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Get single product
export const getProductDetails = createAsyncThunk(
  'products/getProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

// Get featured products
export const getFeaturedProducts = createAsyncThunk(
  'products/getFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/featured/products`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    featuredProducts: [],
    pagination: {},
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProduct: (state) => {
      state.product = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get product details
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get featured products
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload.products;
      });
  }
});

export const { clearError, clearProduct } = productSlice.actions;
export default productSlice.reducer;
