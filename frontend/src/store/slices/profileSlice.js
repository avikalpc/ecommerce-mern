

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get user profile
export const getUserProfile = createAsyncThunk(
  'profile/getUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(`${API_URL}/profile`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

// Update personal information
export const updatePersonalInfo = createAsyncThunk(
  'profile/updatePersonalInfo',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.put(`${API_URL}/profile/personal-info`, userData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (passwordData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.put(`${API_URL}/profile/change-password`, passwordData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

// Get addresses
export const getAddresses = createAsyncThunk(
  'profile/getAddresses',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(`${API_URL}/profile/addresses`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
    }
  }
);

// Add address
export const addAddress = createAsyncThunk(
  'profile/addAddress',
  async (addressData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.post(`${API_URL}/profile/addresses`, addressData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add address');
    }
  }
);

// Update address
export const updateAddress = createAsyncThunk(
  'profile/updateAddress',
  async ({ addressId, addressData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.put(`${API_URL}/profile/addresses/${addressId}`, addressData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update address');
    }
  }
);

// Delete address
export const deleteAddress = createAsyncThunk(
  'profile/deleteAddress',
  async (addressId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.delete(`${API_URL}/profile/addresses/${addressId}`, config);
      return { ...response.data, addressId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    addresses: [],
    loading: false,
    error: null,
    updateSuccess: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update personal info
      .addCase(updatePersonalInfo.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
      })
      .addCase(updatePersonalInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.updateSuccess = true;
      })
      .addCase(updatePersonalInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get addresses
      .addCase(getAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.addresses;
      })
      .addCase(getAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add address
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload.address);
        state.updateSuccess = true;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex(addr => addr._id === action.payload.address._id);
        if (index !== -1) {
          state.addresses[index] = action.payload.address;
        }
        state.updateSuccess = true;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(addr => addr._id !== action.payload.addressId);
        state.updateSuccess = true;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearUpdateSuccess } = profileSlice.actions;
export default profileSlice.reducer;
