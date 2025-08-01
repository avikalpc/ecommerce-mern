

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import PaymentForm from '../components/Payment/PaymentForm';
import { getAddresses } from '../store/slices/profileSlice';
import { getCountryName } from '../utils/countries';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef');

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);
  const { addresses, loading: addressLoading } = useSelector(state => state.profile);
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentStep, setPaymentStep] = useState('address');

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // Fetch addresses
    dispatch(getAddresses());
  }, [dispatch, isAuthenticated, items.length, navigate]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addresses, selectedAddress]);

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }
    setPaymentStep('payment');
  };

  // Transform cart items to ensure proper structure for order creation
  const orderData = {
    orderItems: items.map(item => {
      return {
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item.product?._id || item.product || item._id
      };
    }),
    shippingAddress: selectedAddress,
    itemsPrice: subtotal,
    taxPrice: tax,
    shippingPrice: shipping,
    totalPrice: total
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  if (addressLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="row">
          <div className="col-12 mb-4">
            <nav aria-label="Checkout steps">
              <ol className="breadcrumb">
                <li className={`breadcrumb-item ${paymentStep === 'address' ? 'active' : ''}`}>
                  Shipping Address
                </li>
                <li className={`breadcrumb-item ${paymentStep === 'payment' ? 'active' : ''}`}>
                  Payment
                </li>
                <li className="breadcrumb-item">Confirmation</li>
              </ol>
            </nav>
          </div>

          <div className="col-lg-8">
            {paymentStep === 'address' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-geo-alt me-2"></i>Shipping Address
                  </h5>
                </div>
                <div className="card-body">
                  {addresses.length === 0 ? (
                    <div className="text-center py-4">
                      <p>No addresses found. Please add an address first.</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/profile?tab=addresses')}
                      >
                        Add Address
                      </button>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {addresses.map(address => (
                        <div key={address._id} className="col-md-6">
                          <div 
                            className={`card cursor-pointer ${selectedAddress?._id === address._id ? 'border-primary' : ''}`}
                            onClick={() => setSelectedAddress(address)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="card-body">
                              <div className="d-flex align-items-center mb-2">
                                <input
                                  type="radio"
                                  className="form-check-input me-2"
                                  checked={selectedAddress?._id === address._id}
                                  onChange={() => setSelectedAddress(address)}
                                />
                                <h6 className="mb-0">{address.fullName}</h6>
                                {address.isDefault && (
                                  <span className="badge bg-primary ms-auto">Default</span>
                                )}
                              </div>
                              <p className="text-muted small mb-0">
                                {address.addressLine1}<br />
                                {address.addressLine2 && <>{address.addressLine2}<br /></>}
                                {address.city}, {address.state} {address.zipCode}<br />
                                {getCountryName(address.country)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedAddress && (
                    <div className="mt-4">
                      <button 
                        className="btn btn-primary btn-lg"
                        onClick={handleProceedToPayment}
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {paymentStep === 'payment' && (
              <Elements stripe={stripePromise}>
                <PaymentForm orderData={orderData} />
              </Elements>
            )}
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                {items.map(item => (
                  <div key={item.product?._id || item._id} className="d-flex align-items-center mb-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="rounded me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{item.name}</h6>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                ))}
                
                <hr />
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-primary">${total.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
