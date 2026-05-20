import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiPackage, FiEye } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toggleWishlist } from '../../services/api';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { buildProductWhatsappLink, openWhatsappLink } from '../../utils/whatsapp';

export default function ProductCard({ product }) {
  const { addToCart, cart, increaseQty, decreaseQty } = useCart();
  const { user, refreshUser } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const defaultVariant = product.variants?.find((variant) => variant.stock > 0) || product.variants?.[0] || null;
  const displayPrice = defaultVariant
    ? ((defaultVariant.offerPrice > 0 && defaultVariant.offerPrice < defaultVariant.price) ? defaultVariant.offerPrice : defaultVariant.price)
    : product.price;
  const displayOriginalPrice = defaultVariant
    ? ((defaultVariant.offerPrice > 0 && defaultVariant.offerPrice < defaultVariant.price) ? defaultVariant.price : 0)
    : product.originalPrice;
  const displaySize = defaultVariant?.size || product.packagingSize;
  const cartItem = cart.items?.find(item =>
    item.product._id === product._id && (!defaultVariant || item.selectedSize === defaultVariant.size)
  );
  const qty = cartItem?.quantity || 0;
  const enquiryQuantity = qty > 0 ? qty : Number(defaultVariant?.moq || 1);
  const whatsappLink = buildProductWhatsappLink({
    productName: product.name,
    sku: product.sku,
    price: displayPrice,
    size: displaySize,
    quantity: enquiryQuantity
  });

  useEffect(() => {
    if (!user?.wishlist) { setIsWishlisted(false); return; }
    setIsWishlisted(user.wishlist.some(item =>
      typeof item === 'object' ? item?._id === product._id : item === product._id
    ));
  }, [user, product._id]);

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
    addToCart(product, defaultVariant?.moq || 1, defaultVariant?.size || '');
    setTimeout(() => setAdding(false), 600);
  };

  const handleWhatsAppInquiry = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openWhatsappLink(whatsappLink);
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
        <div
          className="relative overflow-hidden flex items-center justify-center bg-[#F8FCFF] h-[250px] sm:h-[280px] md:h-[300px]"
        >
          <img
            src={images[0]}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-transform duration-500 p-2"
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
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
          {(defaultVariant ? defaultVariant.stock === 0 : product.stock === 0) && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
              <span className="text-white text-xs font-bold px-4 py-2 rounded-full border border-white/30"
                style={{ background: 'rgba(0,0,0,0.4)' }}>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1 gap-2.5">

          {/* Meta */}
          <div className="flex items-center gap-2">
            {product.casNumber && (
              <span className="text-[10px] font-mono text-slate-400 ml-auto">
                {product.casNumber}
              </span>
            )}
          </div>

          {/* Name */}
          <h3
            className="font-semibold tracking-tight text-[16px] leading-snug text-slate-800 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200"
            style={{ fontFamily: 'Inter,sans-serif' }}
          >
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
            {displaySize && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <FiPackage className="w-2.5 h-2.5" /> {displaySize}
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
              <div className="flex items-end gap-2">
                <span
                  className="text-2xl font-black tracking-tight leading-none"
                  style={{ color: '#0B4F9C', fontFamily: 'Inter, sans-serif' }}
                >
                  ₹{displayPrice?.toLocaleString('en-IN')}
                </span> 
                {displayOriginalPrice > displayPrice && (
                  <span className="text-sm line-through text-gray-400 font-medium">
                    ₹{displayOriginalPrice?.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {displaySize && <span className="text-xs text-slate-400">{displaySize}</span>}
                {product.discount > 0 && (
                  <span className="text-xs font-semibold text-green-600">{product.discount}% OFF</span>
                )}
              </div>
            </div>

            {qty > 0 ? (
              <div className="flex items-center gap-2" onClick={e => e.preventDefault()}>
                <button onClick={() => decreaseQty(cartItem.product._id, defaultVariant?.size || '')}
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-sm transition-all hover:scale-110"
                  style={{ background: '#f0f4fe', color: '#0B4F9C' }}>−</button>
                <span className="text-sm font-bold text-slate-700 w-5 text-center">{qty}</span>
                <button onClick={() => increaseQty(cartItem.product._id, defaultVariant?.size || '')}
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-sm text-white transition-all hover:scale-110"
                  style={{ background: 'linear-gradient(135deg,#0B4F9C,#1a70ff)' }}>+</button>
              </div>
            ) : (
              <button onClick={handleAdd} disabled={(defaultVariant ? defaultVariant.stock === 0 : product.stock === 0)}
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

          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.01]"
            style={{
              background: 'linear-gradient(135deg, #25D366, #1fa855)',
              boxShadow: '0 8px 24px rgba(37,211,102,0.22)'
            }}
          >
            <FaWhatsapp className="h-4 w-4" />
            WhatsApp Enquiry
          </button>
        </div>
      </div>
    </Link>
  );
}
