import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cart, loading, updateQuantity, removeItem, clearCart, checkout } = useContext(CartContext);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const navigate = useNavigate();

  if (loading) return <div className="text-center py-20">Loading cart...</div>;

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Successful!</h1>
        <p className="text-gray-600 mb-8">Thank you for supporting local farmers. Your order #{orderSuccess.id} has been placed.</p>
        <Link to="/customer/home" className="inline-block bg-green-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-green-700 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const items = cart?.items || [];
  
  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any fresh produce yet.</p>
        <Link to="/customer/shops" className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 font-medium">
          Start Shopping
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    const result = await checkout();
    setCheckoutLoading(false);
    if (result.success) {
      setOrderSuccess(result.order);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Items ({items.length})</h2>
            <button onClick={clearCart} className="text-sm text-red-600 hover:text-red-800 font-medium">Clear Cart</button>
          </div>
          
          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                <img 
                  src={item.product.image_url || `https://ui-avatars.com/api/?name=${item.product.name}&background=random&size=200`} 
                  alt={item.product.name} 
                  className="w-24 h-24 object-contain rounded-lg bg-gray-50 border border-gray-100 p-2" 
                />
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900">{item.product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">₹{item.product.price} per unit</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-l-lg"
                      disabled={item.quantity <= 1}
                    >−</button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-r-lg"
                      disabled={item.quantity >= item.product.available_quantity}
                    >+</button>
                  </div>
                  
                  <div className="w-20 text-right">
                    <p className="font-bold text-gray-900">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className="font-medium text-gray-900">Free</span>
              </div>
              <div className="pt-4 border-t flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-2xl text-green-700">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={checkoutLoading || items.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? 'Processing...' : (
                <>Checkout <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              By checking out, you agree to our direct-to-farmer purchase policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
