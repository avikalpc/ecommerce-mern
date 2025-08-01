
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { getCart } from '../../store/slices/cartSlice';
import { getWishlist } from '../../store/slices/wishlistSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
      dispatch(getWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    setShowMobileMenu(false);
    navigate('/');
  };

  // Updated handleSearch function with input clearing
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm.trim()}`);
      // Clear the search input after navigating
      setSearchTerm('');
      setShowMobileMenu(false); // Close mobile menu if open
    }
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileMenu && !event.target.closest('.navbar')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMobileMenu]);

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top"
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(10px)',
        zIndex: 1030
      }}
    >
      <div className="container-fluid px-3">
        {/* Brand */}
        <Link className="navbar-brand fw-bold fs-3 me-4" to="/" onClick={closeMobileMenu}>
          <i className="bi bi-shop me-2"></i>
          Shopoholic
        </Link>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggler border-0 p-0"
          type="button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-expanded={showMobileMenu}
          aria-label="Toggle navigation"
          style={{
            background: 'none',
            boxShadow: 'none',
            fontSize: '1.25rem'
          }}
        >
          <i className={`bi ${showMobileMenu ? 'bi-x' : 'bi-list'} text-white`} style={{ fontSize: '1.5rem' }}></i>
        </button>

        {/* Collapsible content */}
        <div className={`collapse navbar-collapse ${showMobileMenu ? 'show' : ''}`} id="navbarNav">
          {/* Search Bar - Desktop */}
          <form className="d-none d-lg-flex mx-auto col-lg-4" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                className="form-control border-0"
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  borderRadius: '25px 0 0 25px',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  height: '42px'
                }}
              />
              <button 
                className="btn btn-light border-0"
                type="submit"
                style={{ 
                  borderRadius: '0 25px 25px 0',
                  height: '42px'
                }}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          {/* Navigation Items */}
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {/* Mobile Search */}
            <li className="nav-item d-lg-none mb-3">
              <form onSubmit={handleSearch} className="px-3">
                <div className="input-group">
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                      borderRadius: '20px 0 0 20px',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      border: 'none'
                    }}
                  />
                  <button 
                    className="btn btn-light"
                    type="submit"
                    style={{ borderRadius: '0 20px 20px 0' }}
                  >
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </li>

            {/* Navigation Links */}
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 py-2 ${location.pathname === '/' ? 'active fw-bold' : ''}`}
                to="/"
                onClick={closeMobileMenu}
                style={{ fontSize: '1.1rem' }}
              >
                <i className="bi bi-house me-2"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 py-2 ${location.pathname === '/products' ? 'active fw-bold' : ''}`}
                to="/products"
                onClick={closeMobileMenu}
                style={{ fontSize: '1.1rem' }}
              >
                <i className="bi bi-grid me-2"></i>Products
              </Link>
            </li>

            {/* Wishlist - Show only when authenticated */}
            {isAuthenticated && (
              <li className="nav-item">
                <Link 
                  className="nav-link px-3 py-2 position-relative" 
                  to="/wishlist"
                  onClick={closeMobileMenu}
                  style={{ fontSize: '1.1rem' }}
                >
                  <i className="bi bi-heart me-2 fs-5"></i>
                  <span className="d-lg-none">Wishlist</span>
                  {wishlistCount > 0 && (
                    <span 
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: '0.7rem', marginLeft: '-10px' }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </li>
            )}

            {/* Cart */}
            <li className="nav-item">
              <Link 
                className="nav-link px-3 py-2 position-relative" 
                to="/cart"
                onClick={closeMobileMenu}
                style={{ fontSize: '1.1rem' }}
              >
                <i className="bi bi-cart me-2 fs-5"></i>
                <span className="d-lg-none">Cart</span>
                {cartItemsCount > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                    style={{ fontSize: '0.7rem', marginLeft: '-10px' }}
                  >
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </li>

            {/* User Menu */}
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-link nav-link dropdown-toggle border-0 text-white d-flex align-items-center px-3"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{ fontSize: '1.1rem' }}
                >
                  <div 
                    className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center me-2"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <i className="bi bi-person"></i>
                  </div>
                  <span>{user?.name}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div 
                  className={`dropdown-menu dropdown-menu-end shadow border-0 ${showUserMenu ? 'show' : ''}`}
                  style={{ 
                    borderRadius: '15px',
                    marginTop: '10px',
                    minWidth: '200px'
                  }}
                >
                  <Link 
                    className="dropdown-item py-2 d-flex align-items-center" 
                    to="/profile" 
                    onClick={() => {
                      setShowUserMenu(false);
                      closeMobileMenu();
                    }}
                  >
                    <i className="bi bi-person-circle me-3"></i>Profile
                  </Link>
                  <Link 
                    className="dropdown-item py-2 d-flex align-items-center" 
                    to="/orders" 
                    onClick={() => {
                      setShowUserMenu(false);
                      closeMobileMenu();
                    }}
                  >
                    <i className="bi bi-box-seam me-3"></i>My Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <>
                      <div className="dropdown-divider"></div>
                      <Link 
                        className="dropdown-item py-2 d-flex align-items-center" 
                        to="/admin" 
                        onClick={() => {
                          setShowUserMenu(false);
                          closeMobileMenu();
                        }}
                      >
                        <i className="bi bi-shield-check me-3"></i>Admin Dashboard
                      </Link>
                    </>
                  )}
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item py-2 text-danger d-flex align-items-center" 
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-3"></i>Logout
                  </button>
                </div>
              </li>
            ) : (
              <li className="nav-item">
                <div className="d-flex flex-column flex-lg-row gap-2 px-3 py-2">
                  <Link 
                    className="btn btn-outline-light rounded-pill px-3 py-2" 
                    to="/login"
                    onClick={closeMobileMenu}
                    style={{ fontSize: '0.95rem' }}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>Login
                  </Link>
                  <Link 
                    className="btn btn-light rounded-pill px-3 py-2" 
                    to="/register"
                    onClick={closeMobileMenu}
                    style={{ fontSize: '0.95rem' }}
                  >
                    <i className="bi bi-person-plus me-2"></i>Register
                  </Link>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
