import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  Paper,
  Divider,
  TextField,
  Avatar,
  CircularProgress,
  IconButton
} from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder, Add, Remove } from '@mui/icons-material';
import { getProductDetails, clearProduct } from '../store/slices/productSlice';
import { addToCart, getCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { product, loading, error } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(getProductDetails(id));
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await dispatch(addToCart({ productId: id, quantity })).unwrap();
      dispatch(getCart());
      toast.success(`${quantity} item(s) added to cart`);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Product not found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The product you're looking for doesn't exist or has been removed.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box>
            <img
              src={product.images[selectedImage]?.url || '/placeholder.jpg'}
              alt={product.name}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            {product.images.length > 1 && (
              <Box display="flex" gap={1} mt={2}>
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid #1976d2' : '2px solid transparent'
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>

          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Rating value={product.ratings} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary">
              ({product.numOfReviews} reviews)
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="h5" color="primary">
              ${product.price}
            </Typography>
            {product.comparePrice && (
              <Typography
                variant="h6"
                sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
              >
                ${product.comparePrice}
              </Typography>
            )}
          </Box>

          <Chip
            label={product.category}
            sx={{ mb: 2 }}
          />

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Box mb={3}>
            <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Typography>
          </Box>

          {/* Quantity Selector */}
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Typography variant="body1">Quantity:</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Remove />
              </IconButton>
              <TextField
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  if (val >= 1 && val <= product.stock) {
                    setQuantity(val);
                  }
                }}
                inputProps={{ min: 1, max: product.stock }}
                sx={{ width: 80 }}
                size="small"
              />
              <IconButton
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                <Add />
              </IconButton>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box display="flex" gap={2} mb={3}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              sx={{ flex: 1 }}
            >
              Add to Cart
            </Button>
            <IconButton size="large" color="primary">
              <FavoriteBorder />
            </IconButton>
          </Box>

          {/* Product Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Specifications
              </Typography>
              {product.specifications.map((spec, index) => (
                <Box key={index} display="flex" justifyContent="space-between" py={0.5}>
                  <Typography variant="body2" fontWeight="medium">
                    {spec.key}:
                  </Typography>
                  <Typography variant="body2">
                    {spec.value}
                  </Typography>
                </Box>
              ))}
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Reviews Section */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom>
          Customer Reviews
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review) => (
            <Paper key={review._id} elevation={1} sx={{ p: 3, mb: 2 }}>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Avatar sx={{ width: 40, height: 40 }}>
                  {review.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">{review.name}</Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
              </Box>
              <Typography variant="body2">
                {review.comment}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No reviews yet. Be the first to review this product!
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ProductDetail;
