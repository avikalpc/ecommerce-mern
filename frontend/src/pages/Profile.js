
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { countryOptions, getCountryName } from '../utils/countries';
import {
  getUserProfile,
  updatePersonalInfo,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  clearError,
  clearUpdateSuccess
} from '../store/slices/profileSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { user: profileUser, addresses, loading, error, updateSuccess } = useSelector(state => state.profile);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Personal Info Form
  const { register: registerPersonal, handleSubmit: handlePersonalSubmit, formState: { errors: personalErrors }, reset: resetPersonal, setValue: setPersonalValue } = useForm();

  // Address Form
  const { register: registerAddress, handleSubmit: handleAddressSubmit, formState: { errors: addressErrors }, reset: resetAddress, setValue: setAddressValue } = useForm();

  // Password Form
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm();

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === 'addresses') {
      dispatch(getAddresses());
    }
  }, [dispatch, activeTab]);

  useEffect(() => {
    if (profileUser) {
      setPersonalValue('name', profileUser.name);
      setPersonalValue('email', profileUser.email);
      setPersonalValue('phoneNumber', profileUser.phoneNumber || '');
    }
  }, [profileUser, setPersonalValue]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Updated successfully!');
      setEditMode(false);
      setShowAddressForm(false);
      setEditingAddress(null);
      setShowPasswordForm(false);
      resetAddress();
      resetPassword();
      dispatch(clearUpdateSuccess());
      
      // Refresh addresses after update
      if (activeTab === 'addresses') {
        dispatch(getAddresses());
      }
    }
  }, [updateSuccess, dispatch, resetAddress, resetPassword, activeTab]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onPersonalInfoSubmit = (data) => {
    dispatch(updatePersonalInfo(data));
  };

  const onAddressSubmit = (data) => {
    if (editingAddress) {
      dispatch(updateAddress({ addressId: editingAddress._id, addressData: data }));
    } else {
      dispatch(addAddress(data));
    }
  };

  const onPasswordSubmit = (data) => {
    dispatch(changePassword(data));
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
    
    // Populate form fields
    Object.keys(address).forEach(key => {
      if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
        setAddressValue(key, address[key]);
      }
    });
  };

  const handleDeleteAddress = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      dispatch(deleteAddress(addressId));
    }
  };

  const handleCancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    resetAddress();
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="row">
          {/* Profile Header */}
          <div className="col-12">
            <div className="card border-0 shadow-sm mb-4">
              <div 
                className="card-header text-white"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center me-3"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className="bi bi-person display-6"></i>
                  </div>
                  <div>
                    <h3 className="mb-1">{profileUser?.name || user?.name}</h3>
                    <p className="mb-0 opacity-75">
                      <i className="bi bi-envelope me-2"></i>{profileUser?.email || user?.email}
                    </p>
                    <small className="opacity-75">
                      Member since {new Date(profileUser?.createdAt || user?.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="col-12 mb-4">
            <ul className="nav nav-pills nav-fill gap-2">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'profile' ? 'active' : ''} btn`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person-circle me-2"></i>Personal Info
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'addresses' ? 'active' : ''} btn`}
                  onClick={() => setActiveTab('addresses')}
                >
                  <i className="bi bi-geo-alt me-2"></i>Addresses
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'security' ? 'active' : ''} btn`}
                  onClick={() => setActiveTab('security')}
                >
                  <i className="bi bi-shield-check me-2"></i>Security
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          <div className="col-12">
            {/* Personal Information Tab */}
            {activeTab === 'profile' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="bi bi-person-circle me-2"></i>Personal Information
                    </h5>
                    {!editMode ? (
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => setEditMode(true)}
                      >
                        <i className="bi bi-pencil me-2"></i>Edit
                      </button>
                    ) : (
                      <div>
                        <button
                          className="btn btn-success me-2"
                          onClick={handlePersonalSubmit(onPersonalInfoSubmit)}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-lg me-2"></i>Save
                            </>
                          )}
                        </button>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => {
                            setEditMode(false);
                            resetPersonal();
                          }}
                        >
                          <i className="bi bi-x-lg me-2"></i>Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handlePersonalSubmit(onPersonalInfoSubmit)}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Full Name</label>
                        <input
                          type="text"
                          className={`form-control form-control-lg ${personalErrors.name ? 'is-invalid' : ''}`}
                          {...registerPersonal('name', {
                            required: 'Name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters' }
                          })}
                          disabled={!editMode}
                          style={{ borderRadius: '8px' }}
                        />
                        {personalErrors.name && (
                          <div className="invalid-feedback">{personalErrors.name.message}</div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Email Address</label>
                        <input
                          type="email"
                          className={`form-control form-control-lg ${personalErrors.email ? 'is-invalid' : ''}`}
                          {...registerPersonal('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          disabled={!editMode}
                          style={{ borderRadius: '8px' }}
                        />
                        {personalErrors.email && (
                          <div className="invalid-feedback">{personalErrors.email.message}</div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control form-control-lg"
                          {...registerPersonal('phoneNumber')}
                          disabled={!editMode}
                          placeholder="Enter phone number"
                          style={{ borderRadius: '8px' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Account Role</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={profileUser?.role || user?.role || 'user'}
                          disabled
                          style={{ borderRadius: '8px' }}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="bi bi-geo-alt me-2"></i>Shipping Addresses
                    </h5>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setShowAddressForm(true);
                        setEditingAddress(null);
                        resetAddress();
                      }}
                    >
                      <i className="bi bi-plus-lg me-2"></i>Add Address
                    </button>
                  </div>
                </div>
                <div className="card-body p-4">
                  {/* Address Form */}
                  {showAddressForm && (
                    <div className="mb-4">
                      <div className="card border-primary">
                        <div className="card-header bg-primary bg-opacity-10">
                          <h6 className="mb-0">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                          </h6>
                        </div>
                        <div className="card-body">
                          <form onSubmit={handleAddressSubmit(onAddressSubmit)}>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label className="form-label">Full Name</label>
                                <input
                                  type="text"
                                  className={`form-control ${addressErrors.fullName ? 'is-invalid' : ''}`}
                                  {...registerAddress('fullName', { required: 'Full name is required' })}
                                />
                                {addressErrors.fullName && (
                                  <div className="invalid-feedback">{addressErrors.fullName.message}</div>
                                )}
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Phone Number</label>
                                <input
                                  type="tel"
                                  className="form-control"
                                  {...registerAddress('phone')}
                                />
                              </div>
                              <div className="col-12">
                                <label className="form-label">Address Line 1</label>
                                <input
                                  type="text"
                                  className={`form-control ${addressErrors.addressLine1 ? 'is-invalid' : ''}`}
                                  {...registerAddress('addressLine1', { required: 'Address line 1 is required' })}
                                />
                                {addressErrors.addressLine1 && (
                                  <div className="invalid-feedback">{addressErrors.addressLine1.message}</div>
                                )}
                              </div>
                              <div className="col-12">
                                <label className="form-label">Address Line 2 (Optional)</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  {...registerAddress('addressLine2')}
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="form-label">City</label>
                                <input
                                  type="text"
                                  className={`form-control ${addressErrors.city ? 'is-invalid' : ''}`}
                                  {...registerAddress('city', { required: 'City is required' })}
                                />
                                {addressErrors.city && (
                                  <div className="invalid-feedback">{addressErrors.city.message}</div>
                                )}
                              </div>
                              <div className="col-md-4">
                                <label className="form-label">State</label>
                                <input
                                  type="text"
                                  className={`form-control ${addressErrors.state ? 'is-invalid' : ''}`}
                                  {...registerAddress('state', { required: 'State is required' })}
                                />
                                {addressErrors.state && (
                                  <div className="invalid-feedback">{addressErrors.state.message}</div>
                                )}
                              </div>
                              <div className="col-md-4">
                                <label className="form-label">ZIP Code</label>
                                <input
                                  type="text"
                                  className={`form-control ${addressErrors.zipCode ? 'is-invalid' : ''}`}
                                  {...registerAddress('zipCode', { required: 'ZIP code is required' })}
                                />
                                {addressErrors.zipCode && (
                                  <div className="invalid-feedback">{addressErrors.zipCode.message}</div>
                                )}
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Country</label>
                                <select
                                  className={`form-control ${addressErrors.country ? 'is-invalid' : ''}`}
                                  {...registerAddress('country', { required: 'Country is required' })}
                                >
                                  <option value="">Select Country</option>
                                  {countryOptions.map(country => (
                                    <option key={country.value} value={country.value}>
                                      {country.displayValue}
                                    </option>
                                  ))}
                                </select>
                                {addressErrors.country && (
                                  <div className="invalid-feedback">{addressErrors.country.message}</div>
                                )}
                              </div>
                              <div className="col-md-6">
                                <div className="form-check mt-4">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    {...registerAddress('isDefault')}
                                  />
                                  <label className="form-check-label">
                                    Set as default address
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3">
                              <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                                {loading ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Saving...
                                  </>
                                ) : (
                                  editingAddress ? 'Update Address' : 'Add Address'
                                )}
                              </button>
                              <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={handleCancelAddressForm}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Address List */}
                  {addresses.length === 0 && !showAddressForm ? (
                    <div className="text-center py-4">
                      <i className="bi bi-house display-1 text-muted mb-3"></i>
                      <h5>No addresses saved</h5>
                      <p className="text-muted">Add an address to get started</p>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {addresses.map(address => (
                        <div key={address._id} className="col-md-6">
                          <div className={`card h-100 ${address.isDefault ? 'border-primary' : ''}`}>
                            <div className="card-body">
                              {address.isDefault && (
                                <span className="badge bg-primary mb-2">Default</span>
                              )}
                              <h6 className="card-title">{address.fullName}</h6>
                              <p className="card-text small text-muted mb-2">
                                {address.addressLine1}<br />
                                {address.addressLine2 && <>{address.addressLine2}<br /></>}
                                {address.city}, {address.state} {address.zipCode}<br />
                                {getCountryName(address.country)}
                                {address.phone && <><br />Phone: {address.phone}</>}
                              </p>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleEditAddress(address)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteAddress(address._id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom">
                  <h5 className="mb-0">
                    <i className="bi bi-shield-check me-2"></i>Security Settings
                  </h5>
                </div>
                <div className="card-body p-4">
                  {/* Change Password */}
                  <div className="card border">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="card-title">
                            <i className="bi bi-key me-2"></i>Password
                          </h6>
                          <p className="card-text text-muted">
                            Change your password to keep your account secure
                          </p>
                        </div>
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => setShowPasswordForm(!showPasswordForm)}
                        >
                          {showPasswordForm ? 'Cancel' : 'Change Password'}
                        </button>
                      </div>

                      {/* Password Change Form */}
                      {showPasswordForm && (
                        <div className="mt-4">
                          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                            <div className="row g-3">
                              <div className="col-12">
                                <label className="form-label">Current Password</label>
                                <input
                                  type="password"
                                  className={`form-control ${passwordErrors.currentPassword ? 'is-invalid' : ''}`}
                                  {...registerPassword('currentPassword', { required: 'Current password is required' })}
                                />
                                {passwordErrors.currentPassword && (
                                  <div className="invalid-feedback">{passwordErrors.currentPassword.message}</div>
                                )}
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">New Password</label>
                                <input
                                  type="password"
                                  className={`form-control ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                                  {...registerPassword('newPassword', {
                                    required: 'New password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                  })}
                                />
                                {passwordErrors.newPassword && (
                                  <div className="invalid-feedback">{passwordErrors.newPassword.message}</div>
                                )}
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Confirm New Password</label>
                                <input
                                  type="password"
                                  className={`form-control ${passwordErrors.confirmPassword ? 'is-invalid' : ''}`}
                                  {...registerPassword('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (value, { newPassword }) =>
                                      value === newPassword || 'Passwords do not match'
                                  })}
                                />
                                {passwordErrors.confirmPassword && (
                                  <div className="invalid-feedback">{passwordErrors.confirmPassword.message}</div>
                                )}
                              </div>
                            </div>
                            <div className="mt-3">
                              <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Updating...
                                  </>
                                ) : (
                                  'Update Password'
                                )}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
