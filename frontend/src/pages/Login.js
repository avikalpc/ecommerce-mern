

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login, clearError } from '../store/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center p-4" 
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-4">
            <div 
              className="card border-0 shadow-lg"
              style={{ 
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="card-body p-5">
                {/* Header Section */}
                <div className="text-center mb-5">
                  <div 
                    className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                    style={{
                      width: '72px',
                      height: '72px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    <i className="bi bi-person-lock text-white" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h1 className="h3 fw-bold mb-2" style={{ color: '#1f2937' }}>
                    Welcome Back
                  </h1>
                  <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
                    Sign in to continue to your account
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div 
                    className="alert alert-danger border-0 mb-4 d-flex align-items-center"
                    style={{ 
                      borderRadius: '12px',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      fontSize: '0.95rem'
                    }}
                  >
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  {/* Email Field */}
                  <div className="mb-4">
                    <label 
                      htmlFor="email" 
                      className="form-label fw-semibold mb-2"
                      style={{ color: '#374151', fontSize: '0.95rem' }}
                    >
                      Email Address
                    </label>
                    <div className="position-relative">
                      <input
                        type="email"
                        id="email"
                        className={`form-control form-control-lg border-2 ${errors.email ? 'is-invalid border-danger' : 'border-light'}`}
                        placeholder="Enter your email address"
                        autoComplete="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address'
                          }
                        })}
                        style={{
                          borderRadius: '12px',
                          paddingLeft: '48px',
                          fontSize: '1rem',
                          height: '56px',
                          boxShadow: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      />
                      <i 
                        className="bi bi-envelope-fill position-absolute text-muted"
                        style={{ 
                          left: '16px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          fontSize: '1.1rem'
                        }}
                      ></i>
                      {errors.email && (
                        <div className="invalid-feedback mt-2" style={{ fontSize: '0.875rem' }}>
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label 
                      htmlFor="password" 
                      className="form-label fw-semibold mb-2"
                      style={{ color: '#374151', fontSize: '0.95rem' }}
                    >
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className={`form-control form-control-lg border-2 ${errors.password ? 'is-invalid border-danger' : 'border-light'}`}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        style={{
                          borderRadius: '12px',
                          paddingLeft: '48px',
                          paddingRight: '48px',
                          fontSize: '1rem',
                          height: '56px',
                          boxShadow: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      />
                      <i 
                        className="bi bi-lock-fill position-absolute text-muted"
                        style={{ 
                          left: '16px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          fontSize: '1.1rem'
                        }}
                      ></i>
                      <button
                        type="button"
                        className="btn position-absolute border-0 bg-transparent p-0"
                        style={{ 
                          right: '16px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          width: '24px',
                          height: '24px'
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i 
                          className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} text-muted`}
                          style={{ fontSize: '1.1rem' }}
                        ></i>
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback mt-2" style={{ fontSize: '0.875rem' }}>
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="rememberMe" 
                        style={{ borderRadius: '4px' }}
                      />
                      <label 
                        className="form-check-label text-muted" 
                        htmlFor="rememberMe"
                        style={{ fontSize: '0.9rem' }}
                      >
                        Remember me
                      </label>
                    </div>
                    <Link 
                      to="/forgot-password" 
                      className="text-decoration-none fw-medium"
                      style={{ 
                        color: '#667eea',
                        fontSize: '0.9rem'
                      }}
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-lg w-100 fw-semibold border-0 mb-4"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '12px',
                      height: '56px',
                      fontSize: '1rem',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    {loading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Signing In...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  {/* Register Link */}
                  <div className="text-center">
                    <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                      Don't have an account?{' '}
                      <Link 
                        to="/register" 
                        className="text-decoration-none fw-semibold"
                        style={{ color: '#667eea' }}
                      >
                        Create Account
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Back to Home Link */}
            <div className="text-center mt-4">
              <Link 
                to="/" 
                className="text-white text-decoration-none d-inline-flex align-items-center"
                style={{ fontSize: '0.95rem', opacity: 0.9 }}
              >
                <i className="bi bi-arrow-left-circle me-2"></i>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
