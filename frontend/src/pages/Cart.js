
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  // Safe calculation with proper error handling
  const calculateSubtotal = () => {
    if (!items || items.length === 0) return 0;
    
    return items.reduce((total, item) => {
      // Ensure both price and quantity exist and are numbers
      const price = typeof item.price === 'number' ? item.price : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return total + (price * quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    try {
      await dispatch(updateCartItem({ productId, quantity: newQuantity })).unwrap();
      dispatch(getCart()); // Refresh cart
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
      toast.success('Item removed from cart');
      dispatch(getCart()); // Refresh cart
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await dispatch(clearCart()).unwrap();
        toast.success('Cart cleared');
      } catch (error) {
        toast.error('Failed to clear cart');
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    navigate('/checkout');
  };

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="text-center">
            <h2>Please Login</h2>
            <p>You need to be logged in to view your cart.</p>
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="display-6 fw-bold">
                <i className="bi bi-cart me-2"></i>
                Shopping Cart
              </h1>
              {items && items.length > 0 && (
                <button 
                  className="btn btn-outline-danger"
                  onClick={handleClearCart}
                >
                  <i className="bi bi-trash me-2"></i>Clear Cart
                </button>
              )}
            </div>

            {!items || items.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-4">
                  <i className="bi bi-cart-x display-1 text-muted"></i>
                </div>
                <h3 className="fw-bold mb-3">Your cart is empty</h3>
                <p className="text-muted mb-4">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Link to="/products" className="btn btn-primary btn-lg">
                  <i className="bi bi-shop me-2"></i>Start Shopping
                </Link>
              </div>
            ) : (
              <div className="row g-4">
                {/* Cart Items */}
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body p-0">
                      {items.map((item, index) => {
                        // Safely get product info
                        const product = item.product || {};
                        const productId = product._id || item.product;
                        const productName = item.name || product.name || 'Unknown Product';
                        const productImage = item.image || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&q=80';
                        const productPrice = typeof item.price === 'number' ? item.price : 0;
                        const productQuantity = typeof item.quantity === 'number' ? item.quantity : 1;

                        return (
                          <div key={productId || index} className="p-4 border-bottom">
                            <div className="row align-items-center">
                              <div className="col-md-2">
                                <img
                                  src={productImage}
                                  alt={productName}
                                  className="img-fluid rounded"
                                  style={{ height: '80px', objectFit: 'cover' }}
                                />
                              </div>
                              <div className="col-md-4">
                                <h6 className="fw-bold mb-1">{productName}</h6>
                                <small className="text-muted">
                                  Product ID: {productId?.slice(-8) || 'N/A'}
                                </small>
                              </div>
                              <div className="col-md-2">
                                <div className="fw-bold text-primary">
                                  ${productPrice.toFixed(2)}
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="input-group input-group-sm">
                                  <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleQuantityChange(productId, productQuantity - 1)}
                                  >
                                    <i className="bi bi-dash"></i>
                                  </button>
                                  <input
                                    type="number"
                                    className="form-control text-center"
                                    value={productQuantity}
                                    onChange={(e) => {
                                      const newQty = parseInt(e.target.value) || 1;
                                      handleQuantityChange(productId, newQty);
                                    }}
                                    min="1"
                                  />
                                  <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleQuantityChange(productId, productQuantity + 1)}
                                  >
                                    <i className="bi bi-plus"></i>
                                  </button>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="fw-bold">
                                  ${(productPrice * productQuantity).toFixed(2)}
                                </div>
                              </div>
                              <div className="col-md-1 text-end">
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleRemoveItem(productId)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Cart Summary */}
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-bottom">
                      <h5 className="mb-0">Order Summary</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal ({items.length} items):</span>
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
                      <div className="d-flex justify-content-between mb-3">
                        <strong>Total:</strong>
                        <strong className="text-primary">${total.toFixed(2)}</strong>
                      </div>
                      
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-primary btn-lg"
                          onClick={handleCheckout}
                        >
                          <i className="bi bi-credit-card me-2"></i>
                          Proceed to Checkout
                        </button>
                        <Link
                          to="/products"
                          className="btn btn-outline-primary"
                        >
                          <i className="bi bi-arrow-left me-2"></i>
                          Continue Shopping
                        </Link>
                      </div>

                      {subtotal < 50 && (
                        <div className="alert alert-info mt-3 small">
                          <i className="bi bi-info-circle me-2"></i>
                          Add ${(50 - subtotal).toFixed(2)} more for free shipping!
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

export default Cart;
