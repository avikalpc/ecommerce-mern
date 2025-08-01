import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { confirmPayment } from '../store/slices/paymentSlice';
import { toast } from 'react-toastify';

const PaymentSimulation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder, loading } = useSelector(state => state.payment);
  
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  const handlePaymentDecision = async (isSuccess) => {
    setProcessing(true);
    
    try {
      const result = await dispatch(confirmPayment({
        orderId,
        status: isSuccess ? 'success' : 'failed',
        paymentIntentId: currentOrder?.paymentInfo?.id || 'dummy_payment_intent'
      })).unwrap();

      if (isSuccess) {
        toast.success('Payment successful! Redirecting to orders...');
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        toast.error('Payment failed. Please try again.');
        setTimeout(() => {
          navigate('/checkout');
        }, 2000);
      }
    } catch (error) {
      toast.error(error);
      setProcessing(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="card-body p-5 text-center">
                {/* Payment Processing Animation */}
                <div className="mb-4">
                  <div 
                    className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                    style={{
                      width: '100px',
                      height: '100px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }}
                  >
                    <i className="bi bi-credit-card text-white" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                </div>

                <h2 className="display-6 fw-bold text-dark mb-3">
                  Payment Processing Simulation
                </h2>
                
                <p className="lead text-muted mb-4">
                  This is a demo environment. Please choose the payment outcome to simulate:
                </p>

                <div className="alert alert-info mb-4">
                  <h6 className="alert-heading">
                    <i className="bi bi-info-circle me-2"></i>Demo Mode
                  </h6>
                  <p className="mb-0">
                    In production, payment processing would be handled automatically by Stripe. 
                    For demonstration purposes, you can simulate either outcome.
                  </p>
                </div>

                {currentOrder && (
                  <div className="mb-4 p-3 bg-light rounded">
                    <h6 className="fw-bold mb-2">Order Details:</h6>
                    <div className="row text-start">
                      <div className="col-6">
                        <small className="text-muted">Order ID:</small>
                        <div className="fw-medium">{currentOrder._id?.slice(-8).toUpperCase()}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Amount:</small>
                        <div className="fw-medium">${currentOrder.totalPrice?.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-grid gap-3">
                  <button
                    className="btn btn-success btn-lg"
                    onClick={() => handlePaymentDecision(true)}
                    disabled={processing}
                    style={{ borderRadius: '12px' }}
                  >
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Simulate Successful Payment
                      </>
                    )}
                  </button>
                  
                  <button
                    className="btn btn-danger btn-lg"
                    onClick={() => handlePaymentDecision(false)}
                    disabled={processing}
                    style={{ borderRadius: '12px' }}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Simulate Failed Payment
                  </button>
                </div>

                <div className="mt-4">
                  <small className="text-muted">
                    <i className="bi bi-shield-check me-1"></i>
                    Your data is secure and this is just a simulation
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default PaymentSimulation;
