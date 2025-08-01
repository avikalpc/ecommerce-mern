


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Process payment
export const processPayment = createAsyncThunk(
  'payment/processPayment',
  async ({ paymentIntentId, orderData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      console.log('Sending payment request with:', { paymentIntentId, orderData });
      
      const response = await axios.post(`${API_URL}/payment/process-payment`, {
        paymentIntentId,
        orderData
      }, config);
      
      return response.data;
    } catch (error) {
      console.error('Payment API error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to process payment');
    }
  }
);

// Confirm payment
export const confirmPayment = createAsyncThunk(
  'payment/confirmPayment',
  async ({ orderId, status, paymentIntentId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.post(`${API_URL}/payment/confirm-payment`, {
        orderId,
        status,
        paymentIntentId
      }, config);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to confirm payment');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    loading: false,
    error: null,
    currentOrder: null,
    paymentSuccess: false
  },
  reducers: {
    clearPayment: (state) => {
      state.currentOrder = null;
      state.paymentSuccess = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Process payment
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Confirm payment
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.paymentSuccess = action.payload.success;
        state.currentOrder = action.payload.order;
      });
  }
});

export const { clearPayment, clearError } = paymentSlice.actions;
export default paymentSlice.reducer;
