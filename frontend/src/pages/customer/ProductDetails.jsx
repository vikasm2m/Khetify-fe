import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { CartContext } from '../../context/CartContext';
import { ShoppingCart, ArrowLeft, Check, AlertCircle } from 'lucide-react';

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const result = await addToCart(product.id, quantity);
    setAddingToCart(false);
    
    if (result.success) {
      alert(`Added ${quantity} of ${product.name} to cart!`);
    } else {
      if (result.conflict) {
        if (window.confirm(`${result.message}\n\nDo you want to go to your cart to clear it?`)) {
          navigate('/customer/cart');
        }
      } else {
        alert(result.message);
      }
    }
  };

  if (loading) return <div className="text-center py-20">Loading product...</div>;
  if (!product) return <div className="text-center py-20 text-red-500">Product not found.</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-green-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="md:flex">
          {/* Image Gallery */}
          <div className="md:w-1/2 p-8 bg-gray-50 flex items-center justify-center">
            <img 
              src={product.image_url || `https://ui-avatars.com/api/?name=${product.name}&background=random&size=400`} 
              alt={product.name} 
              className="max-w-full h-auto object-contain rounded-xl shadow-sm mix-blend-multiply" 
            />
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-6">
              <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
              <span className="text-lg text-gray-500 mb-1">/ unit</span>
            </div>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {product.description || "No description provided for this product."}
            </p>

            <div className="mb-8">
              {product.available_quantity > 0 ? (
                <div className="flex items-center text-green-700 mb-4">
                  <Check className="w-5 h-5 mr-2" />
                  <span className="font-medium">In Stock ({product.available_quantity} available)</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 mb-4">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
                    disabled={quantity <= 1}
                  >−</button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.available_quantity, parseInt(e.target.value) || 1)))}
                    className="w-16 text-center py-3 font-semibold focus:outline-none"
                    min="1"
                    max={product.available_quantity}
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(product.available_quantity, quantity + 1))}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
                    disabled={quantity >= product.available_quantity}
                  >+</button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={product.available_quantity === 0 || addingToCart}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.available_quantity === 0 ? 'Out of Stock' : addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Sold By</h3>
              <Link to={`/customer/shops/${product.shop_id}`} className="text-green-600 hover:text-green-800 hover:underline flex items-center gap-2 font-medium">
                Visit Shop Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
