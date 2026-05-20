import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiShoppingBag, FiPackage } from 'react-icons/fi';
import { getWishlist, toggleWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { refreshUser } = useAuth();

  useEffect(() => {
    getWishlist().then(r => { setWishlist(r.data.wishlist?.products || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const remove = async (productId) => {
    try {
      await toggleWishlist({ productId });
      setWishlist((current) => current.filter((product) => product._id !== productId));
      await refreshUser();
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const getDefaultVariant = (product) => (
    product?.variants?.find((variant) => variant.stock > 0) || product?.variants?.[0] || null
  );

  const getDisplayPrice = (product) => {
    const defaultVariant = getDefaultVariant(product);
    if (!defaultVariant) {
      return {
        price: product.price,
        originalPrice: product.originalPrice,
        size: product.packagingSize || ''
      };
    }

    const discounted = defaultVariant.offerPrice > 0 && defaultVariant.offerPrice < defaultVariant.price;
    return {
      price: discounted ? defaultVariant.offerPrice : defaultVariant.price,
      originalPrice: discounted ? defaultVariant.price : 0,
      size: defaultVariant.size
    };
  };

  const handleAddToCart = async (product) => {
    const defaultVariant = getDefaultVariant(product);
    await addToCart(product, defaultVariant?.moq || 1, defaultVariant?.size || '');
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map(product => (
            <div key={product._id} className="card group overflow-hidden">
              <div className="relative h-[260px] bg-[#F8FCFF] flex items-center justify-center p-3">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400'}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
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
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-[#0B4F9C]">
                      ₹{getDisplayPrice(product).price?.toLocaleString('en-IN')}
                    </p>
                    {getDisplayPrice(product).originalPrice > getDisplayPrice(product).price && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{getDisplayPrice(product).originalPrice?.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  {getDisplayPrice(product).size && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <FiPackage className="w-3 h-3" /> {getDisplayPrice(product).size}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAddToCart(product)} className="btn-primary flex-1 py-2 text-sm flex items-center justify-center gap-2">
                    Add to Cart
                  </button>
                  <Link to={`/products/${product.slug}`} className="btn-outline flex-1 py-2 text-sm text-center">
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
