import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart, getCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading, error } = useSelector(state => state.wishlist);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success('Item removed from wishlist');
      dispatch(getWishlist()); // Refresh wishlist
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      dispatch(getCart());
      toast.success('Item added to cart');
    } catch (error) {
      toast.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Please Login</h2>
          <p>You need to be logged in to view your wishlist.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  if (loading) {
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
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="display-6 fw-bold">
                <i className="bi bi-heart-fill text-danger me-2"></i>
                My Wishlist
              </h1>
              {wishlistItems.length > 0 && (
                <span className="badge bg-primary fs-6">
                  {wishlistItems.length} items
                </span>
              )}
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {wishlistItems.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-4">
                  <i className="bi bi-heart display-1 text-muted"></i>
                </div>
                <h3 className="fw-bold mb-3">Your wishlist is empty</h3>
                <p className="text-muted mb-4">
                  Save items you love to your wishlist and never lose track of them.
                </p>
                <Link to="/products" className="btn btn-primary btn-lg">
                  <i className="bi bi-shop me-2"></i>Start Shopping
                </Link>
              </div>
            ) : (
              <div className="row g-4">
                {wishlistItems.map((item) => {
                  const product = item.product;
                  return (
                    <div key={item._id || product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="position-relative">
                          <img
                            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&q=80'}
                            className="card-img-top"
                            alt={product.name}
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                          <button
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                            onClick={() => handleRemoveFromWishlist(product._id)}
                            title="Remove from wishlist"
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                        
                        <div className="card-body d-flex flex-column">
                          <h6 className="card-title fw-bold">
                            <Link 
                              to={`/product/${product._id}`} 
                              className="text-decoration-none text-dark"
                            >
                              {product.name}
                            </Link>
                          </h6>
                          
                          <div className="d-flex align-items-center mb-2">
                            <div className="text-warning me-2">
                              {[...Array(5)].map((_, i) => (
                                <i 
                                  key={i} 
                                  className={`bi bi-star${i < Math.floor(product.ratings || 0) ? '-fill' : ''} small`}
                                ></i>
                              ))}
                            </div>
                            <small className="text-muted">({product.numOfReviews || 0})</small>
                          </div>

                          <div className="mt-auto">
                            <div className="mb-3">
                              <h5 className="text-primary fw-bold mb-0">${product.price}</h5>
                              {product.comparePrice && (
                                <small className="text-muted text-decoration-line-through">
                                  ${product.comparePrice}
                                </small>
                              )}
                            </div>

                            <div className="d-grid gap-2">
                              <button
                                className="btn btn-primary"
                                onClick={() => handleAddToCart(product._id)}
                                disabled={product.stock === 0}
                              >
                                <i className="bi bi-cart-plus me-2"></i>
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
