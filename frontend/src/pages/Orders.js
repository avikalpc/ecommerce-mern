

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../store/slices/orderSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showTracking, setShowTracking] = useState(null);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'warning';
      case 'Confirmed': return 'info';
      case 'Shipped': return 'primary';
      case 'Delivered': return 'success';
      case 'Cancelled': return 'danger';
      case 'Payment Failed': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing': return 'bi-clock';
      case 'Confirmed': return 'bi-check-circle';
      case 'Shipped': return 'bi-truck';
      case 'Delivered': return 'bi-check-circle-fill';
      case 'Cancelled': return 'bi-x-circle';
      case 'Payment Failed': return 'bi-exclamation-triangle';
      default: return 'bi-circle';
    }
  };

  const TrackingTimeline = ({ tracking }) => {
    if (!tracking || !tracking.trackingHistory) return null;

    return (
      <div className="tracking-timeline">
        <h6 className="fw-bold mb-3">
          <i className="bi bi-geo-alt me-2"></i>
          Tracking: {tracking.trackingNumber}
        </h6>
        
        <div className="timeline">
          {tracking.trackingHistory.map((event, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker">
                <div className={`timeline-dot bg-${index === 0 ? 'primary' : 'secondary'}`}></div>
              </div>
              <div className="timeline-content">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-1">{event.status}</h6>
                  <small className="text-muted">
                    {new Date(event.timestamp).toLocaleString()}
                  </small>
                </div>
                <p className="text-muted mb-1">{event.description}</p>
                <small className="text-primary">
                  <i className="bi bi-geo-alt-fill me-1"></i>
                  {event.location}
                </small>
              </div>
            </div>
          ))}
        </div>

        {tracking.estimatedDelivery && (
          <div className="alert alert-info mt-3">
            <i className="bi bi-clock me-2"></i>
            <strong>Estimated Delivery: </strong>
            {new Date(tracking.estimatedDelivery).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}
      </div>
    );
  };

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
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div 
              className="card border-0 shadow-sm"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <i className="bi bi-box-seam display-6"></i>
                  </div>
                  <div>
                    <h1 className="display-6 fw-bold mb-2">My Orders</h1>
                    <p className="mb-0 opacity-75">
                      Track and manage all your orders in one place
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-box display-1 text-muted"></i>
                  </div>
                  <h3 className="fw-bold mb-3">No orders found</h3>
                  <p className="text-muted mb-4">
                    You haven't placed any orders yet. Start shopping to see your orders here.
                  </p>
                  <Link to="/products" className="btn btn-primary btn-lg">
                    <i className="bi bi-shop me-2"></i>Start Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {orders.map((order) => (
              <div key={order._id} className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-bottom-0 p-4">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <h5 className="mb-1 fw-bold">
                          <i className="bi bi-receipt me-2"></i>
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h5>
                        <p className="text-muted mb-0">
                          <i className="bi bi-calendar me-2"></i>
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="col-md-6 text-md-end">
                        <span className={`badge bg-${getStatusColor(order.orderStatus)} fs-6 px-3 py-2 mb-2`}>
                          <i className={`${getStatusIcon(order.orderStatus)} me-2`}></i>
                          {order.orderStatus}
                        </span>
                        <div>
                          <strong className="fs-5 text-primary">
                            ${order.totalPrice.toFixed(2)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    <div className="row">
                      {/* Order Items Preview */}
                      <div className="col-md-8">
                        <h6 className="fw-bold mb-3">
                          <i className="bi bi-basket me-2"></i>
                          Items ({order.orderItems.length})
                        </h6>
                        <div className="row g-2">
                          {order.orderItems.slice(0, 3).map((item, index) => (
                            <div key={index} className="col-4 col-md-3">
                              <div className="card border">
                                <img
                                  src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&q=80'}
                                  className="card-img-top"
                                  alt={item.name}
                                  style={{ height: '80px', objectFit: 'cover' }}
                                />
                                <div className="card-body p-2">
                                  <p className="card-text small text-truncate">
                                    {item.name}
                                  </p>
                                  <small className="text-muted">
                                    Qty: {item.quantity}
                                  </small>
                                </div>
                              </div>
                            </div>
                          ))}
                          {order.orderItems.length > 3 && (
                            <div className="col-4 col-md-3">
                              <div 
                                className="card border d-flex align-items-center justify-content-center text-muted"
                                style={{ height: '140px' }}
                              >
                                <div className="text-center">
                                  <i className="bi bi-three-dots display-6"></i>
                                  <p className="small mb-0">
                                    +{order.orderItems.length - 3} more
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="col-md-4">
                        <h6 className="fw-bold mb-3">
                          <i className="bi bi-calculator me-2"></i>
                          Order Summary
                        </h6>
                        <div className="card bg-light border-0">
                          <div className="card-body">
                            <div className="d-flex justify-content-between mb-2">
                              <span>Items:</span>
                              <span>${order.itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Shipping:</span>
                              <span>${order.shippingPrice.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Tax:</span>
                              <span>${order.taxPrice.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                              <span>Total:</span>
                              <span className="text-primary">
                                ${order.totalPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="row mt-4">
                      <div className="col-12">
                        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
                          <div className="text-muted small">
                            {order.deliveredAt && (
                              <span>
                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                              </span>
                            )}
                            {order.paidAt && !order.deliveredAt && (
                              <span>
                                <i className="bi bi-credit-card-fill text-info me-2"></i>
                                Paid on {new Date(order.paidAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => setExpandedOrder(
                                expandedOrder === order._id ? null : order._id
                              )}
                            >
                              <i className={`bi ${expandedOrder === order._id ? 'bi-chevron-up' : 'bi-chevron-down'} me-2`}></i>
                              {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                            </button>
                            
                            {order.tracking && (
                              <button
                                className="btn btn-info"
                                onClick={() => setShowTracking(
                                  showTracking === order._id ? null : order._id
                                )}
                              >
                                <i className="bi bi-geo-alt me-2"></i>
                                Track Package
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedOrder === order._id && (
                      <div className="row mt-4">
                        <div className="col-12">
                          <div className="border-top pt-4">
                            <h6 className="fw-bold mb-3">
                              <i className="bi bi-list-ul me-2"></i>
                              All Items
                            </h6>
                            <div className="table-responsive">
                              <table className="table table-sm">
                                <thead>
                                  <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.orderItems.map((item, index) => (
                                    <tr key={index}>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <img
                                            src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&q=80'}
                                            alt={item.name}
                                            className="rounded me-2"
                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                          />
                                          <span>{item.name}</span>
                                        </div>
                                      </td>
                                      <td>${item.price.toFixed(2)}</td>
                                      <td>{item.quantity}</td>
                                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Shipping Address */}
                            <div className="mt-4">
                              <h6 className="fw-bold mb-3">
                                <i className="bi bi-truck me-2"></i>
                                Shipping Address
                              </h6>
                              <div className="card bg-light border-0">
                                <div className="card-body">
                                  <p className="mb-0">
                                    <strong>{order.shippingAddress.fullName}</strong><br />
                                    {order.shippingAddress.addressLine1}<br />
                                    {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                                    {order.shippingAddress.country}
                                    {order.shippingAddress.phone && <><br />Phone: {order.shippingAddress.phone}</>}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tracking Details */}
                    {showTracking === order._id && order.tracking && (
                      <div className="row mt-4">
                        <div className="col-12">
                          <div className="border-top pt-4">
                            <TrackingTimeline tracking={order.tracking} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: 30px;
        }
        
        .timeline::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #dee2e6;
        }
        
        .timeline-item {
          position: relative;
          margin-bottom: 30px;
        }
        
        .timeline-marker {
          position: absolute;
          left: -37px;
          top: 0;
        }
        
        .timeline-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 0 0 2px #dee2e6;
        }
        
        .timeline-content {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
          margin-left: 15px;
        }
      `}</style>
    </div>
  );
};

export default Orders;
