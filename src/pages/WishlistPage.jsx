import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { getWishlist, toggleWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import { Loader } from '../components/common/Loader';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    getWishlist().then(r => { setWishlist(r.data.wishlist?.products || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const remove = async (productId) => {
    await toggleWishlist({ productId });
    setWishlist(w => w.filter(p => p._id !== productId));
    toast.success('Removed from wishlist');
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <FiHeart className="text-red-500 w-6 h-6" />
        My Wishlist
        <span className="text-gray-400 font-normal text-lg">({wishlist.length})</span>
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          {/* <div className="text-7xl mb-6">💝</div> */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love for later</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            <FiShoppingBag /> Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map(product => (
            <div key={product._id} className="card group overflow-hidden">
              <div className="relative aspect-square bg-gray-50">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => remove(product._id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/products/${product.slug}`} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 text-sm mb-2 block">
                  {product.name}
                </Link>
                <p className="text-lg font-bold text-gray-900 mb-3">₹{product.price}</p>
                <button onClick={() => addToCart(product._id)} className="btn-primary w-full py-2 text-sm flex items-center justify-center gap-2">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
