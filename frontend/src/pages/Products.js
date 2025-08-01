import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../store/slices/productSlice';
import { addToCart, getCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, getWishlist } from '../store/slices/wishlistSlice';
import { toast } from 'react-toastify';


const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, pagination, loading, error } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);
  const { items: wishlistItems, loading: wishlistLoading } = useSelector(state => state.wishlist);

  const [filters, setFilters] = useState({
    page: Number(searchParams.get('page')) || 1,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
  const wishlistProductIds = new Set(wishlistItems.map(item => item.product._id));

  useEffect(() => {
    dispatch(getProducts(filters));
    if (isAuthenticated) {
      dispatch(getWishlist());
    }
    
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.set(key, filters[key]);
    });
    setSearchParams(params);
  }, [dispatch, filters, setSearchParams, isAuthenticated]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value
    }));
  };

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



  const handlePriceFilter = () => {
    setFilters(prev => ({
      ...prev,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      page: 1
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setPriceRange({ min: '', max: '' });
  };

  const getPaginationPages = () => {
    const pages = [];
    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;
    
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading && products.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h1 className="display-6 fw-bold text-dark mb-2">Products</h1>
                {pagination.totalProducts > 0 && (
                  <p className="text-muted mb-0">
                    <i className="bi bi-grid-3x3-gap me-2"></i>
                    {pagination.totalProducts} products found
                  </p>
                )}
              </div>
              <button 
                className="btn btn-outline-primary d-lg-none"
                type="button"
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className="bi bi-funnel me-2"></i>Filters
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Filters Sidebar */}
          <div className={`col-lg-3 mb-4 ${showFilters ? 'd-block' : 'd-none d-lg-block'}`}>
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-primary text-white" style={{ borderRadius: '15px 15px 0 0' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-funnel me-2"></i>Filters
                  </h5>
                  <button 
                    className="btn btn-sm btn-outline-light"
                    onClick={clearFilters}
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className="card-body p-4">
                {/* Search Filter */}
                {/* <div className="mb-4">
                  <label className="form-label fw-medium">
                    <i className="bi bi-search me-2"></i>Search
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    style={{ borderRadius: '10px' }}
                  />
                </div> */}

                {/* Category Filter */}
                <div className="mb-4">
                  <label className="form-label fw-medium">
                    <i className="bi bi-tags me-2"></i>Category
                  </label>
                  <select
                    className="form-select"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    style={{ borderRadius: '10px' }}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-4">
                  <label className="form-label fw-medium">
                    <i className="bi bi-currency-dollar me-2"></i>Price Range
                  </label>
                  <div className="row g-2">
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        style={{ borderRadius: '10px' }}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        style={{ borderRadius: '10px' }}
                      />
                    </div>
                  </div>
                  <button 
                    className="btn btn-outline-primary btn-sm mt-2 w-100"
                    onClick={handlePriceFilter}
                  >
                    Apply Price Filter
                  </button>
                </div>

                {/* Rating Filter */}
                <div className="mb-4">
                  <label className="form-label fw-medium">
                    <i className="bi bi-star me-2"></i>Minimum Rating
                  </label>
                  <select
                    className="form-select"
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    style={{ borderRadius: '10px' }}
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Stars</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="mb-0">
                  <label className="form-label fw-medium">
                    <i className="bi bi-sort-down me-2"></i>Sort By
                  </label>
                  <select
                    className="form-select"
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      handleFilterChange('sortBy', sortBy);
                      handleFilterChange('sortOrder', sortOrder);
                    }}
                    style={{ borderRadius: '10px' }}
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="ratings-desc">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-lg-9">
            {products.length === 0 && !loading ? (
              <div className="text-center py-5">
                <div className="display-1 text-muted mb-3">
                  <i className="bi bi-search"></i>
                </div>
                <h3 className="text-muted">No products found</h3>
                <p className="text-muted">Try adjusting your search or filter criteria</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="row g-4 mb-4">
                  {products.map((product) => (
                    <div key={product._id} className="col-12 col-sm-6 col-xl-4">
                      <div 
                        className="card h-100 shadow-sm border-0 position-relative"
                        style={{ 
                          borderRadius: '15px',
                          transition: 'all 0.3s ease',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                        }}
                      >
                        {/* Product Image */}
                        <div className="position-relative overflow-hidden">
                          <img
                            src={product.images[0]?.url || '/placeholder.jpg'}
                            className="card-img-top"
                            alt={product.name}
                            style={{ 
                              height: '250px', 
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
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

                          {/* Stock Status */}
                          {product.stock <= 5 && product.stock > 0 && (
                            <span 
                              className="badge bg-warning text-dark position-absolute"
                              style={{ bottom: '10px', left: '10px' }}
                            >
                              Only {product.stock} left!
                            </span>
                          )}
                        </div>

                        <div className="card-body d-flex flex-column p-4">
                          {/* Product Category */}
                          <div className="mb-2">
                            <span className="badge bg-light text-primary rounded-pill">
                              <i className="bi bi-tag me-1"></i>{product.category}
                            </span>
                            {product.brand && (
                              <span className="badge bg-secondary rounded-pill ms-2">
                                {product.brand}
                              </span>
                            )}
                          </div>

                          {/* Product Title */}
                          <h5 className="card-title fw-bold mb-2">
                            <Link 
                              to={`/product/${product._id}`} 
                              className="text-decoration-none text-dark stretched-link"
                              style={{ zIndex: 2 }}
                            >
                              {product.name}
                            </Link>
                          </h5>

                          {/* Product Description */}
                          <p className="card-text text-muted small mb-3" style={{ lineHeight: '1.4' }}>
                            {product.description.substring(0, 100)}...
                          </p>

                          {/* Rating */}
                          <div className="d-flex align-items-center mb-3">
                            <div className="text-warning me-2">
                              {[...Array(5)].map((_, i) => (
                                <i 
                                  key={i} 
                                  className={`bi bi-star${i < Math.floor(product.ratings) ? '-fill' : ''}`}
                                ></i>
                              ))}
                            </div>
                            <small className="text-muted">
                              ({product.numOfReviews} reviews)
                            </small>
                          </div>

                          {/* Price */}
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                              <h4 className="text-primary fw-bold mb-0">
                                ${product.price}
                              </h4>
                              {product.comparePrice && (
                                <small className="text-muted text-decoration-line-through">
                                  ${product.comparePrice}
                                </small>
                              )}
                            </div>
                            {product.stock === 0 && (
                              <span className="badge bg-danger">Out of Stock</span>
                            )}
                          </div>

                          {/* Add to Cart Button */}
                          <button
                            className="btn btn-primary w-100 mt-auto position-relative"
                            style={{ 
                              borderRadius: '10px',
                              zIndex: 3
                            }}
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
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="d-flex justify-content-center">
                    <nav aria-label="Products pagination">
                      <ul className="pagination pagination-lg">
                        <li className={`page-item ${!pagination.hasPrev ? 'disabled' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => handleFilterChange('page', 1)}
                            disabled={!pagination.hasPrev}
                          >
                            <i className="bi bi-chevron-double-left"></i>
                          </button>
                        </li>
                        <li className={`page-item ${!pagination.hasPrev ? 'disabled' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                            disabled={!pagination.hasPrev}
                          >
                            <i className="bi bi-chevron-left"></i>
                          </button>
                        </li>
                        
                        {getPaginationPages().map(page => (
                          <li key={page} className={`page-item ${page === pagination.currentPage ? 'active' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => handleFilterChange('page', page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        
                        <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                            disabled={!pagination.hasNext}
                          >
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        </li>
                        <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => handleFilterChange('page', pagination.totalPages)}
                            disabled={!pagination.hasNext}
                          >
                            <i className="bi bi-chevron-double-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
