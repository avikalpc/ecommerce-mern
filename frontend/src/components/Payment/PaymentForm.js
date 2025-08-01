
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { processPayment } from '../../store/slices/paymentSlice';
import { getCountryCode } from '../../utils/countries';

const PaymentForm = ({ orderData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [processing, setProcessing] = useState(false);
  const [cardHolder, setCardHolder] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!cardHolder.trim()) {
      toast.error('Please enter cardholder name');
      return;
    }

    console.log('Submitting payment with order data:', orderData);

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      // Convert country name to ISO code
      const countryCode = getCountryCode(orderData.shippingAddress.country);
      
      console.log('Original country:', orderData.shippingAddress.country);
      console.log('Converted country code:', countryCode);

      // Create payment method with proper country code
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: cardHolder,
          address: {
            line1: orderData.shippingAddress.addressLine1,
            line2: orderData.shippingAddress.addressLine2 || '',
            city: orderData.shippingAddress.city,
            state: orderData.shippingAddress.state,
            postal_code: orderData.shippingAddress.zipCode,
            country: countryCode,
          },
        },
      });

      if (error) {
        console.error('Stripe error:', error);
        toast.error(error.message);
        setProcessing(false);
        return;
      }

      console.log('Payment method created successfully:', paymentMethod);

      // Process payment through our backend
      const result = await dispatch(processPayment({
        paymentIntentId: paymentMethod.id,
        orderData
      })).unwrap();

      if (result.success) {
        navigate(`/payment-simulation/${result.order._id}`);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error(typeof error === 'string' ? error : 'Payment processing failed');
      setProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-credit-card me-2"></i>Payment Details
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-medium">Cardholder Name</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="John Doe"
              required
              style={{ borderRadius: '8px' }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium">Card Details</label>
            <div 
              className="form-control form-control-lg"
              style={{ borderRadius: '8px', padding: '16px' }}
            >
              <CardElement options={cardStyle} />
            </div>
          </div>

          <div className="alert alert-info">
            <h6><i className="bi bi-info-circle me-2"></i>Test Card Numbers:</h6>
            <ul className="mb-0 small">
              <li><strong>Success:</strong> 4242 4242 4242 4242</li>
              <li><strong>Decline:</strong> 4000 0000 0000 0002</li>
              <li><strong>CVC:</strong> Any 3 digits</li>
              <li><strong>Expiry:</strong> Any future date</li>
            </ul>
          </div>

          <button
            type="submit"
            className="btn btn-success btn-lg w-100"
            disabled={!stripe || processing}
            style={{ borderRadius: '8px' }}
          >
            {processing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Processing Payment...
              </>
            ) : (
              <>
                <i className="bi bi-lock-fill me-2"></i>
                Pay ${orderData.totalPrice.toFixed(2)}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
