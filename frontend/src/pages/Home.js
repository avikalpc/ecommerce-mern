import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '../store/slices/productSlice';
import { addToCart, getCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, getWishlist } from '../store/slices/wishlistSlice';
import { toast } from 'react-toastify';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featuredProducts, loading } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);
  const { items: wishlistItems, loading: wishlistLoading } = useSelector(state => state.wishlist);

  const wishlistProductIds = new Set(wishlistItems.map(item => item.product?._id || item.product));

  useEffect(() => {
    dispatch(getFeaturedProducts());
    if (isAuthenticated) {
      dispatch(getWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      dispatch(getCart());
      toast.success('Item added to cart');
    } catch (error) {
      toast.error(error);
    }
  };

    const handleWishlistToggle = async (productId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      navigate('/login');
      return;
    }

    if (wishlistLoading) return; // Prevent multiple clicks

    try {
      if (wishlistProductIds.has(productId)) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        toast.success('Item removed from wishlist');
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        toast.success('Item added to wishlist');
      }
      // Refresh wishlist
      dispatch(getWishlist());
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to update wishlist');
    }
  };


  const categories = [
  { 
    name: 'Electronics', 
    icon: 'bi-cpu-fill', 
    color: 'primary', 
    count: '2,847', 
    description: 'Latest gadgets & tech',
    bgImage: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=800&q=80',
    subCategories: ['Smartphones', 'Laptops', 'Cameras', 'Audio'],
    trending: true
  },
  { 
    name: 'Clothing', 
    icon: 'bi-handbag-fill', 
    color: 'success', 
    count: '1,923', 
    description: 'Fashion & apparel',
    bgImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80',
    subCategories: ['Men\'s Fashion', 'Women\'s Fashion', 'Shoes', 'Accessories'],
    trending: false
  },
  { 
    name: 'Books', 
    icon: 'bi-book-fill', 
    color: 'info', 
    count: '3,456', 
    description: 'Knowledge & stories',
    bgImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    subCategories: ['Fiction', 'Non-Fiction', 'Educational', 'Comics'],
    trending: false
  },
  { 
    name: 'Home & Garden', 
    icon: 'bi-house-heart-fill', 
    color: 'warning', 
    count: '1,234', 
    description: 'Home essentials',
    bgImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    subCategories: ['Furniture', 'Kitchen', 'Garden', 'Decor'],
    trending: true
  },
  { 
    name: 'Sports', 
    icon: 'bi-trophy-fill', 
    color: 'danger', 
    count: '892', 
    description: 'Fitness & outdoor',
    bgImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    subCategories: ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports'],
    trending: false
  },
  { 
    name: 'Beauty', 
    icon: 'bi-heart-fill', 
    color: 'pink', 
    count: '1,567', 
    description: 'Beauty & personal care',
    bgImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    subCategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrance'],
    trending: true
  }
];

  const features = [
    {
      icon: 'bi-truck',
      title: 'Free Worldwide Shipping',
      description: 'Free shipping on orders over $50. Fast delivery to your doorstep worldwide.',
      color: 'primary'
    },
    {
      icon: 'bi-shield-check',
      title: '100% Secure Payment',
      description: 'Your payment information is protected with bank-level security and encryption.',
      color: 'success'
    },
    {
      icon: 'bi-arrow-clockwise',
      title: '30-Day Easy Returns',
      description: 'Not satisfied? Return any item within 30 days for a full refund.',
      color: 'info'
    },
    {
      icon: 'bi-headset',
      title: '24/7 Customer Support',
      description: 'Our customer service team is available around the clock to help you.',
      color: 'warning'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing shopping experience! Fast delivery and excellent customer service.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVyc29ufGVufDB8fDB8fHww'
    },
    {
      name: 'Mike Chen',
      rating: 5,
      comment: 'Great quality products at competitive prices. Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Emily Davis',
      rating: 5,
      comment: 'Love the variety of products. The website is easy to navigate too.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80'
    }
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }


  const newsletterfun = () => {
    return (e) => {
      const emailInput = e.target.querySelector('input[type="email"]');
      if (!emailInput.value) {
        toast.error('Please enter a valid email address');
        return;
      }
      e.preventDefault();
      toast.success('Thank you for subscribing to our newsletter!');
      emailInput.value = ''; // Clear the input after submission
    };
  };

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section 
        className="hero-section text-white d-flex align-items-center position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '70vh'
        }}
      >
        {/* Animated background elements */}
        <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
          <div 
            className="position-absolute rounded-circle"
            style={{
              top: '10%',
              left: '10%',
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              animation: 'float 6s ease-in-out infinite'
            }}
          />
          <div 
            className="position-absolute rounded-circle"
            style={{
              top: '60%',
              right: '15%',
              width: '150px',
              height: '150px',
              background: 'rgba(255,255,255,0.1)',
              animation: 'float 4s ease-in-out infinite reverse'
            }}
          />
        </div>

        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="display-3 fw-bold mb-4">
                  Discover Your Perfect
                  <span className="d-block text-warning">Shopping Experience</span>
                </h1>
                <p className="lead mb-4 opacity-90" style={{ fontSize: '1.2rem' }}>
                  Shop from millions of products with unbeatable prices, fast shipping, 
                  and excellent customer service. Your satisfaction is our priority.
                </p>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-image position-relative">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80" 
                  alt="Shopping Experience" 
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxHeight: '500px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-white border-bottom">
        <div className="container">
          <div className="row text-center">
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <div className="display-6 fw-bold text-primary mb-2">500K+</div>
              <div className="text-muted">Happy Customers</div>
            </div>
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <div className="display-6 fw-bold text-success mb-2">50K+</div>
              <div className="text-muted">Products</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="display-6 fw-bold text-warning mb-2">99.9%</div>
              <div className="text-muted">Uptime</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="display-6 fw-bold text-info mb-2">24/7</div>
              <div className="text-muted">Support</div>
            </div>
          </div>
        </div>
      </section>


{/* Categories Section JSX (replace the existing categories section) */}
<section className="py-5 bg-white">
  <div className="container">
    <div className="text-center mb-5">
      <h2 className="display-5 fw-bold text-dark mb-3">Shop by Category</h2>
      <p className="lead text-muted">Explore our extensive collection across all categories</p>
    </div>

    {/* Main Categories Grid */}
    <div className="row g-4 mb-5">
      {categories.map((category, index) => (
        <div key={index} className="col-6 col-md-4 col-lg-2">
          <Link 
            to={`/products?category=${category.name}`}
            className="text-decoration-none"
          >
            <div 
              className="card h-100 border-0 shadow-sm position-relative overflow-hidden category-card"
              style={{ 
                transition: 'all 0.4s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              {/* Background Image Overlay */}
              <div 
                className="position-absolute w-100 h-100"
                style={{
                  backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${category.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.1,
                  transition: 'opacity 0.3s ease'
                }}
              />
              
              {/* Trending Badge */}
              {category.trending && (
                <div className="position-absolute top-0 end-0 m-2">
                  <span className="badge bg-danger rounded-pill">
                    <i className="bi bi-fire me-1"></i>Trending
                  </span>
                </div>
              )}

              <div className="card-body p-4 text-center position-relative">
                {/* Icon with animated background */}
                <div 
                  className={`rounded-circle bg-${category.color === 'pink' ? 'danger' : category.color} bg-opacity-15 d-inline-flex align-items-center justify-content-center mb-3 position-relative`}
                  style={{ 
                    width: '70px', 
                    height: '70px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className={`${category.icon} text-${category.color === 'pink' ? 'danger' : category.color} fs-3`}></i>
                  
                  {/* Pulse animation ring */}
                  <div 
                    className={`position-absolute rounded-circle bg-${category.color === 'pink' ? 'danger' : category.color}`}
                    style={{
                      width: '70px',
                      height: '70px',
                      opacity: 0.3,
                      animation: 'pulse-ring 2s infinite'
                    }}
                  />
                </div>

                <h5 className="card-title fw-bold text-dark mb-2">{category.name}</h5>
                <p className="card-text text-muted small mb-2">{category.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className={`text-${category.color === 'pink' ? 'danger' : category.color} fw-bold`}>
                    {category.count} items
                  </small>
                  <i className={`bi bi-arrow-right text-${category.color === 'pink' ? 'danger' : category.color}`}></i>
                </div>

                {/* Sub-categories on hover */}
                <div 
                  className="position-absolute w-100 h-100 top-0 start-0 d-flex flex-column justify-content-center align-items-center p-3"
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => { e.target.style.opacity = 1; }}
                  onMouseLeave={(e) => { e.target.style.opacity = 0; }}
                >
                  <h6 className="fw-bold mb-2 text-dark">Popular in {category.name}</h6>
                  {category.subCategories.map((sub, idx) => (
                    <small key={idx} className="text-muted d-block mb-1">{sub}</small>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>

    {/* Category Highlights Banner */}
    <div className="row g-4">
      <div className="col-md-6">
        <div 
          className="card bg-primary text-white border-0 h-100 position-relative overflow-hidden"
          style={{ minHeight: '200px' }}
        >
          <div 
            className="position-absolute w-100 h-100"
            style={{
              backgroundImage: `linear-gradient(45deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8)), url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="card-body d-flex flex-column justify-content-center position-relative">
            <h3 className="card-title fw-bold mb-3">
              <i className="bi bi-lightning-charge-fill me-2"></i>
              Electronics Sale
            </h3>
            <p className="card-text mb-3">Up to 70% off on latest gadgets and tech accessories</p>
            <Link to="/products?category=Electronics" className="btn btn-warning fw-semibold">
              Shop Electronics <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div 
          className="card bg-success text-white border-0 h-100 position-relative overflow-hidden"
          style={{ minHeight: '200px' }}
        >
          <div 
            className="position-absolute w-100 h-100"
            style={{
              backgroundImage: `linear-gradient(45deg, rgba(16, 185, 129, 0.8), rgba(5, 150, 105, 0.8)), url(https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="card-body d-flex flex-column justify-content-center position-relative">
            <h3 className="card-title fw-bold mb-3">
              <i className="bi bi-bag-heart-fill me-2"></i>
              Fashion Week
            </h3>
            <p className="card-text mb-3">Discover the latest trends in fashion and apparel</p>
            <Link to="/products?category=Clothing" className="btn btn-warning fw-semibold">
              Shop Fashion <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <style jsx>{`
    @keyframes pulse-ring {
      0% {
        transform: scale(1);
        opacity: 0.3;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.1;
      }
      100% {
        transform: scale(1);
        opacity: 0.3;
      }
    }
  `}</style>
</section>


      {/* Featured Products Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 className="display-5 fw-bold text-dark mb-2">Featured Products</h2>
              <p className="text-muted mb-0">Handpicked products just for you</p>
            </div>
            <Link to="/products" className="btn btn-outline-primary btn-lg d-none d-md-block">
              View All Products <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>

          <div className="row g-4">
            {featuredProducts.slice(0, 8).map((product) => (
              <div key={product._id} className="col-6 col-md-4 col-lg-3">
                <div 
                  className="card h-100 border-0 shadow-sm position-relative product-card"
                  style={{ 
                    transition: 'all 0.3s ease',
                    overflow: 'hidden'
                  }}
                >
                  <div className="position-relative">
                    <img
                      src={product.images[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&q=80'}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: '220px', objectFit: 'cover' }}
                    />
                    
                    {/* Wishlist Button */}
                      <button
                      className="btn btn-light rounded-circle position-absolute shadow-sm"
              style={{ 
                top: '10px', 
                right: '10px',
                width: '40px',
                height: '40px',
                zIndex: 2
              }}
              onClick={(e) => handleWishlistToggle(product._id, e)}
              disabled={wishlistLoading}
            >
              {wishlistLoading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <i className={`bi ${wishlistProductIds.has(product._id) ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
              )}
            </button>

                    {/* Discount Badge */}
                    {product.comparePrice && (
                      <span 
                        className="badge bg-danger position-absolute"
                        style={{ top: '10px', left: '10px', fontSize: '0.8rem' }}
                      >
                        {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                      </span>
                    )}

                    {/* Quick View Overlay */}
                    <div 
                      className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{ 
                        background: 'rgba(0,0,0,0.7)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      }}
                      onMouseEnter={(e) => { e.target.style.opacity = 1; }}
                      onMouseLeave={(e) => { e.target.style.opacity = 0; }}
                    >
                      <Link 
                        to={`/product/${product._id}`}
                        className="btn btn-light rounded-pill px-4"
                      >
                        <i className="bi bi-eye me-2"></i>Quick View
                      </Link>
                    </div>
                  </div>

                  <div className="card-body d-flex flex-column p-3">
                    <div className="mb-2">
                      <span className="badge bg-light text-primary rounded-pill small">
                        {product.category}
                      </span>
                    </div>

                    <h6 className="card-title fw-bold mb-2">
                      <Link 
                        to={`/product/${product._id}`} 
                        className="text-decoration-none text-dark stretched-link"
                      >
                        {product.name}
                      </Link>
                    </h6>

                    <div className="d-flex align-items-center mb-2">
                      <div className="text-warning me-2">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`bi bi-star${i < Math.floor(product.ratings) ? '-fill' : ''} small`}
                          ></i>
                        ))}
                      </div>
                      <small className="text-muted">({product.numOfReviews})</small>
                    </div>

                    <div className="mt-auto">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div>
                          <h5 className="text-primary fw-bold mb-0">${product.price}</h5>
                          {product.comparePrice && (
                            <small className="text-muted text-decoration-line-through">
                              ${product.comparePrice}
                            </small>
                          )}
                        </div>
                        {product.stock <= 5 && product.stock > 0 && (
                          <small className="text-warning">
                            <i className="bi bi-exclamation-triangle-fill me-1"></i>
                            Low Stock
                          </small>
                        )}
                      </div>

                      <button
                        className="btn btn-primary w-100 position-relative"
                        style={{ zIndex: 3 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product._id);
                        }}
                        disabled={product.stock === 0}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5 d-md-none">
            <Link to="/products" className="btn btn-outline-primary btn-lg">
              View All Products <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-3">Why Shop With Us?</h2>
            <p className="lead text-muted">We provide the best shopping experience with premium services</p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="card border-0 bg-white shadow-sm h-100 text-center feature-card">
                  <div className="card-body p-4">
                    <div 
                      className={`rounded-circle bg-${feature.color} bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3`}
                      style={{ width: '70px', height: '70px' }}
                    >
                      <i className={`${feature.icon} text-${feature.color} fs-3`}></i>
                    </div>
                    <h5 className="fw-bold mb-3">{feature.title}</h5>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-3">What Our Customers Say</h2>
            <p className="lead text-muted">Don't just take our word for it</p>
          </div>
          <div className="row g-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4 text-center">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="rounded-circle mb-3"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                    <div className="text-warning mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill"></i>
                      ))}
                    </div>
                    <p className="text-muted mb-3">"{testimonial.comment}"</p>
                    <h6 className="fw-bold mb-0">{testimonial.name}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section 
        className="py-5 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="mb-4">
                <i className="bi bi-envelope-heart display-4 mb-3"></i>
              </div>
              <h3 className="display-6 fw-bold mb-3">Stay In The Loop</h3>
              <p className="lead mb-4 opacity-90">
                Subscribe to our newsletter for exclusive deals, new arrivals, and special offers
              </p>
              <form className="d-flex flex-column flex-sm-row gap-3 justify-content-center" onSubmit={newsletterfun()}>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Enter your email address"
                  style={{ maxWidth: '350px', borderRadius: '50px' }}
                />
                <button 
                  className="btn btn-warning btn-lg px-4 fw-semibold" 
                  type="submit"
                  style={{ borderRadius: '50px', minWidth: '140px' }}
                >
                  Subscribe
                </button>
              </form>
              <small className="opacity-75 mt-3 d-block">
                <i className="bi bi-shield-check me-1"></i>
                We respect your privacy. Unsubscribe anytime.
              </small>
              <small className="opacity-75 mt-3 d-block">
                &copy; 2025 Shopoholic. All rights reserved.
              </small>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .category-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default Home;
