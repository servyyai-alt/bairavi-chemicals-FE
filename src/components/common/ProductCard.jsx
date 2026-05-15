import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiPackage, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toggleWishlist } from '../../services/api';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const GRADE_STYLES = {
  industrial:    { bg: 'rgba(11,79,156,0.08)',    color: '#0B4F9C',  border: 'rgba(11,79,156,0.2)'  },
  laboratory:    { bg: 'rgba(34,197,94,0.08)',    color: '#16a34a',  border: 'rgba(34,197,94,0.2)'  },
  analytical:    { bg: 'rgba(20,184,166,0.08)',   color: '#0d9488',  border: 'rgba(20,184,166,0.2)' },
  pharmaceutical:{ bg: 'rgba(245,158,11,0.08)',   color: '#d97706',  border: 'rgba(245,158,11,0.2)' },
  reagent:       { bg: 'rgba(139,92,246,0.08)',   color: '#7c3aed',  border: 'rgba(139,92,246,0.2)' },
  technical:     { bg: 'rgba(100,116,139,0.08)',  color: '#475569',  border: 'rgba(100,116,139,0.2)'},
};

export default function ProductCard({ product }) {
  const { addToCart, cart, increaseQty, decreaseQty } = useCart();
  const { user, refreshUser } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!user?.wishlist) { setIsWishlisted(false); return; }
    setIsWishlisted(user.wishlist.some(item =>
      typeof item === 'object' ? item?._id === product._id : item === product._id
    ));
  }, [user, product._id]);

  const cartItem = cart.items?.find(item => item.product._id === product._id);
  const qty = cartItem?.quantity || 0;
  const gradeStyle = GRADE_STYLES[product.grade] || GRADE_STYLES.technical;

  const handleWishlist = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { toast.error('Please sign in first'); return; }
    try {
      const { data } = await toggleWishlist({ productId: product._id });
      setIsWishlisted(prev => !prev);
      await refreshUser();
      toast.success(data.message);
    } catch { toast.error('Failed to update wishlist'); }
  };

  const handleAdd = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { toast.error('Please sign in first'); return; }
    setAdding(true);
    addToCart(product, 1);
    setTimeout(() => setAdding(false), 600);
  };

  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=500&q=80'];

  return (
    <Link to={`/products/${product.slug}`} className="block group">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative bg-white overflow-hidden flex flex-col h-full transition-all duration-400"
        style={{
          borderRadius: '24px',
          border: '1px solid rgba(11,79,156,0.07)',
          boxShadow: hovered ? '0 24px 64px rgba(11,79,156,0.12)' : '0 4px 32px rgba(0,0,0,0.05)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Image wrapper */}
        <div className="relative overflow-hidden" style={{ height: '200px', background: '#f0f4fe' }}>
          <img
            src={images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(to top, rgba(11,79,156,0.55) 0%, transparent 60%)',
              opacity: hovered ? 1 : 0,
            }} />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isFeatured && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                style={{ background: 'linear-gradient(135deg,#0B4F9C,#1a70ff)' }}>
                ★ Featured
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                style={{ background: 'linear-gradient(135deg,#dc2626,#ef4444)' }}>
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: isWishlisted ? '#ef4444' : 'rgba(255,255,255,0.9)',
              color: isWishlisted ? 'white' : '#94a3b8',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              transform: hovered || isWishlisted ? 'scale(1)' : 'scale(0.85)',
            }}>
            <FiHeart className="w-3.5 h-3.5" fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Quick view on hover */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center transition-all duration-300"
            style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(8px)' }}>
            <span className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <FiEye className="w-3 h-3" /> View Details
            </span>
          </div>

          {/* Out of stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
              <span className="text-white text-xs font-bold px-4 py-2 rounded-full border border-white/30"
                style={{ background: 'rgba(0,0,0,0.4)' }}>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1 gap-2.5">

          {/* Grade + Category */}
          <div className="flex items-center gap-2">
            {product.grade && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                style={{ background: gradeStyle.bg, color: gradeStyle.color, border: `1px solid ${gradeStyle.border}` }}>
                {product.grade}
              </span>
            )}
            {product.casNumber && (
              <span className="text-[10px] font-mono text-slate-400 ml-auto">
                {product.casNumber}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-display font-semibold text-[14px] leading-snug text-slate-800 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Specs row */}
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {product.purity && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-accent-teal inline-block" />
                {product.purity} pure
              </span>
            )}
            {product.packagingSize && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <FiPackage className="w-2.5 h-2.5" /> {product.packagingSize}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <FiStar key={s} className="w-3 h-3" fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'}
                    color={s <= Math.round(product.rating) ? '#f59e0b' : '#d1d5db'} />
                ))}
              </div>
              <span className="text-[11px] text-slate-400">({product.numReviews})</span>
            </div>
          )}

          {/* Price + Add to cart */}
          <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold font-display" style={{ color: '#0B4F9C' }}>
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400">/{product.unit || 'kg'}</span>
              </div>
              {product.originalPrice > product.price && (
                <div className="text-xs text-slate-400 line-through leading-none">
                  ₹{product.originalPrice?.toLocaleString('en-IN')}
                </div>
              )}
            </div>

            {qty > 0 ? (
              <div className="flex items-center gap-2" onClick={e => e.preventDefault()}>
                <button onClick={() => decreaseQty(cartItem.product._id)}
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-sm transition-all hover:scale-110"
                  style={{ background: '#f0f4fe', color: '#0B4F9C' }}>−</button>
                <span className="text-sm font-bold text-slate-700 w-5 text-center">{qty}</span>
                <button onClick={() => increaseQty(cartItem.product._id)}
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-sm text-white transition-all hover:scale-110"
                  style={{ background: 'linear-gradient(135deg,#0B4F9C,#1a70ff)' }}>+</button>
              </div>
            ) : (
              <button onClick={handleAdd} disabled={product.stock === 0}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all duration-200 disabled:opacity-40"
                style={{
                  background: adding ? 'linear-gradient(135deg,#16a34a,#22c55e)' : 'linear-gradient(135deg,#0B4F9C,#1a70ff)',
                  boxShadow: '0 4px 16px rgba(11,79,156,0.3)',
                  transform: adding ? 'scale(0.96)' : 'scale(1)',
                }}>
                {adding ? '✓ Added' : <><FiShoppingCart className="w-3.5 h-3.5" /> Add</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
