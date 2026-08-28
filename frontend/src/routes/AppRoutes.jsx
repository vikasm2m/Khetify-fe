import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Profile from '../pages/Profile';
import CustomerLayout from '../components/layout/CustomerLayout';
import CustomerHome from '../pages/customer/Home';
import Shops from '../pages/customer/Shops';
import ShopDetails from '../pages/customer/ShopDetails';
import ProductDetails from '../pages/customer/ProductDetails';
import Cart from '../pages/customer/Cart';
import MyOrders from '../pages/customer/MyOrders';
import FarmerLayout from '../components/layout/FarmerLayout';
import FarmerDashboard from '../pages/farmer/Dashboard';
import MyShop from '../pages/farmer/MyShop';
import Products from '../pages/farmer/Products';
import ShopOrders from '../pages/farmer/ShopOrders';
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminShops from '../pages/admin/Shops';
import AdminUsers from '../pages/admin/Users';
import AdminProducts from '../pages/admin/Products';

import Landing from '../pages/Landing';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Customer Routes with Layout */}
      <Route path="/customer" element={
        <ProtectedRoute allowedRoles={['CUSTOMER']}>
          <CustomerLayout />
        </ProtectedRoute>
      }>
        <Route path="home" element={<CustomerHome />} />
        <Route path="shops" element={<Shops />} />
        <Route path="shops/:shopId" element={<ShopDetails />} />
        <Route path="products/:productId" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Farmer Routes with Layout */}
      <Route path="/farmer" element={
        <ProtectedRoute allowedRoles={['FARMER']}>
          <FarmerLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<FarmerDashboard />} />
        <Route path="shop" element={<MyShop />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<ShopOrders />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Admin Routes with Layout */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="shops" element={<AdminShops />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};
