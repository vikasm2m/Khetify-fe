import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Plus } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

export default function ShopDetails() {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const [shopRes, prodRes] = await Promise.all([
          api.get(`/shops/${shopId}`),
          api.get(`/shops/${shopId}/products`)
        ]);
        setShop(shopRes.data);
        setProducts(prodRes.data);
      } catch (error) {
        console.error("Failed to fetch shop details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShopDetails();
  }, [shopId]);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      const msg = error.response?.data?.detail || 'Failed to add item to cart';
      alert(msg);
    }
  };

  if (loading) return <div className="text-center py-20">Loading shop details...</div>;
  if (!shop) return <div className="text-center py-20 text-red-500">Shop not found.</div>;

  return (
    <div>
      {/* Shop Header */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-10 border border-gray-100">
        <div className="h-64 bg-green-800 relative w-full overflow-hidden">
           <img src={shop.image_url || `https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80`} alt="Cover" className="w-full h-full object-cover opacity-60" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
           <div className="absolute bottom-8 left-8 right-8 text-white">
             <h1 className="text-4xl font-bold mb-2">{shop.name}</h1>
             <p className="text-lg text-gray-200 mb-4 max-w-3xl">{shop.description}</p>
             <p className="text-sm font-medium flex items-center gap-2">📍 {shop.address || 'Address not provided'}</p>
           </div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">All Products from {shop.name}</h2>
        <span className="text-gray-500">{products.length} products available</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const cartItem = cart?.items?.find(item => item.product_id === product.id);
          const quantityInCart = cartItem ? cartItem.quantity : 0;
          
          return (
          <Link key={product.id} to={`/customer/products/${product.id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100 flex flex-col">
            <div className="h-48 bg-gray-50 w-full p-4 flex items-center justify-center">
              <img src={product.image_url || `https://ui-avatars.com/api/?name=${product.name}&background=random&size=400`} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <span className="text-xs font-semibold text-green-600 uppercase mb-1">{product.category}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{product.available_quantity > 0 ? `${product.available_quantity} in stock` : 'Out of stock'}</p>
              
              <div className="mt-auto flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                <div className="flex items-center gap-2">
                  {quantityInCart > 0 && (
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full whitespace-nowrap">
                      {quantityInCart} in cart
                    </span>
                  )}
                  <button 
                    disabled={product.available_quantity <= 0}
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`p-2 rounded-full shadow-sm transition-colors ${product.available_quantity > 0 ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        )})}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">This shop hasn't added any products yet.</p>
        </div>
      )}
    </div>
  );
}
