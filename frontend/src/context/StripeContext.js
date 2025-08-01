import React, { createContext, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key');

const StripeContext = createContext();

export const StripeProvider = ({ children }) => {
  return (
    <StripeContext.Provider value={{ stripePromise }}>
      {children}
    </StripeContext.Provider>
  );
};

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};
