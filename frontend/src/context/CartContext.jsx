import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user || user.role !== 'CUSTOMER') {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity) => {
    try {
      const response = await api.post('/cart/items', { product_id: productId, quantity });
      setCart(response.data);
      return { success: true };
    } catch (error) {
      if (error.response?.data?.detail?.includes('CART_CONFLICT')) {
        return { success: false, conflict: true, message: error.response.data.detail };
      }
      return { success: false, message: error.response?.data?.detail || 'Failed to add item' };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await api.patch(`/cart/items/${itemId}`, { quantity });
      setCart(response.data);
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to remove item', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await api.delete('/cart/clear');
      setCart(response.data);
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  };

  const checkout = async () => {
    try {
      const response = await api.post('/orders/checkout');
      await fetchCart(); // refresh cart (it should be empty now)
      return { success: true, order: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.detail || 'Checkout failed' };
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      checkout,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
