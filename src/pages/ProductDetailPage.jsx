import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiShoppingCart, FiHeart, FiStar, FiPackage, FiShield,
  FiChevronLeft, FiCheckCircle, FiAlertTriangle, FiInfo, FiArrowRight
} from 'react-icons/fi';
import { getProduct, addReview, toggleWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'desc', label: 'Description' },
  { id: 'spec', label: 'Specifications' },
  { id: 'safe', label: 'Safety Data' },
  { id: 'app',  label: 'Applications' },
  { id: 'rev',  label: 'Reviews' },
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, increaseQty, decreaseQty } = useCart();
  const { user, refreshUser } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('desc');
  const [activeImg, setActiveImg] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getProduct(slug);
        setProduct(data.product);
        if (user?.wishlist) {
          setIsWishlisted(user.wishlist.some(i => (typeof i === 'object' ? i._id : i) === data.product._id));
        }
      } catch { toast.error('Product not found'); navigate('/products'); }
      setLoading(false);
    })();
  }, [slug, user]);

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="skeleton h-96 rounded-3xl" />
        <div className="space-y-4">
          {[80, 60, 40, 70, 50].map((w, i) => <div key={i} className="skeleton h-6 rounded-xl" style={{ width: `${w}%` }} />)}
        </div>
      </div>
    </div>
  );
  if (!product) return null;

  const cartItem = cart.items?.find(i => i.product._id === product._id);
  const qty = cartItem?.quantity || 0;
  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=700&q=80'];

  const handleWishlist = async () => {
    if (!user) { toast.error('Please sign in first'); return; }
    try {
      const { data } = await toggleWishlist({ productId: product._id });
      setIsWishlisted(p => !p); await refreshUser();
      toast.success(data.message);
    } catch { toast.error('Failed to update wishlist'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to review'); return; }
    setSubmitting(true);
    try {
      await addReview(product._id, { rating: reviewRating, comment: reviewText });
      toast.success('Review submitted!');
      setReviewText(''); setReviewRating(5);
      const { data } = await getProduct(slug);
      setProduct(data.product);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit'); }
    setSubmitting(false);
  };

  return (
    <div style={{ background: '#f8faff', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-slate-600 font-medium truncate">{product.name}</span>
        </div>

        {/* Main grid */}
        <div className="grid md:grid-cols-2 gap-10 mb-12">

          {/* Images */}
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-3xl aspect-square"
              style={{ background: '#e8f0ff' }}>
              <img src={images[activeImg]} alt={product.name}
                className="w-full h-full object-cover transition-all duration-500" />
              {product.discount > 0 && (
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full text-white"
                  style={{ background: 'linear-gradient(135deg,#dc2626,#ef4444)' }}>
                  -{product.discount}% OFF
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden transition-all duration-200"
                    style={{ border: activeImg === i ? '2px solid #0B4F9C' : '2px solid transparent', opacity: activeImg === i ? 1 : 0.6 }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            {product.grade && (
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl capitalize"
                style={{ background: 'rgba(11,79,156,0.08)', color: '#0B4F9C', border: '1px solid rgba(11,79,156,0.15)' }}>
                {product.grade} grade
              </span>
            )}

            <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-800" style={{ letterSpacing: '-0.02em' }}>
              {product.name}
            </h1>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <FiStar key={s} className="w-4 h-4" fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} color={s <= Math.round(product.rating) ? '#f59e0b' : '#d1d5db'} />)}
                </div>
                <span className="text-sm font-semibold text-slate-600">{product.rating?.toFixed(1)}</span>
                <span className="text-sm text-slate-400">({product.numReviews} reviews)</span>
              </div>
            )}

            {/* Chemical quick specs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                ['CAS Number', product.casNumber, 'font-mono'],
                ['Purity', product.purity, ''],
                ['Formula', product.molecularFormula, 'font-mono'],
                ['Packaging', product.packagingSize, ''],
              ].filter(([, v]) => v).map(([k, v, cls]) => (
                <div key={k} className="p-3 rounded-2xl" style={{ background: '#f0f4fe', border: '1px solid rgba(11,79,156,0.08)' }}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{k}</div>
                  <div className={`text-sm font-semibold text-slate-700 ${cls}`}>{v}</div>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 py-2">
              <span className="font-display text-4xl font-bold" style={{ color: '#0B4F9C', letterSpacing: '-0.03em' }}>
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              <span className="text-slate-400 mb-1 text-sm">/ {product.unit || 'kg'}</span>
              {product.originalPrice > product.price && (
                <span className="text-slate-400 line-through mb-1 text-sm">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
              )}
            </div>
            <p className="text-xs text-slate-400 -mt-3">+ {product.gstRate || 18}% GST applicable. Prices exclusive of tax.</p>

            {/* Stock */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                style={product.stock > 0
                  ? { background: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)' }
                  : { background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }}>
                {product.stock > 0 ? <><FiCheckCircle className="w-3 h-3" /> In Stock ({product.stock} {product.unit})</> : 'Out of Stock'}
              </span>
              {product.minOrderQty > 1 && (
                <span className="text-xs text-slate-400">Min. Order: {product.minOrderQty} {product.unit}</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              {qty > 0 ? (
                <div className="flex items-center gap-4 flex-1 p-3 rounded-2xl" style={{ background: '#f0f4fe' }}>
                  <button onClick={() => decreaseQty(cartItem.product._id)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all hover:scale-110"
                    style={{ background: 'white', color: '#0B4F9C', boxShadow: '0 2px 8px rgba(11,79,156,0.15)' }}>−</button>
                  <span className="flex-1 text-center font-bold text-lg text-slate-800">{qty}</span>
                  <button onClick={() => increaseQty(cartItem.product._id)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white transition-all hover:scale-110"
                    style={{ background: 'linear-gradient(135deg,#0B4F9C,#1a70ff)', boxShadow: '0 4px 16px rgba(11,79,156,0.35)' }}>+</button>
                </div>
              ) : (
                <button
                  onClick={() => { if (!user) { toast.error('Please sign in'); return; } addToCart(product, 1); }}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-300 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#0B4F9C,#1a70ff)', boxShadow: '0 8px 32px rgba(11,79,156,0.35)' }}
                  onMouseEnter={e => { if (product.stock > 0) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
                  <FiShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
              )}
              <button onClick={handleWishlist}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={isWishlisted
                  ? { background: '#ef4444', color: 'white', boxShadow: '0 4px 16px rgba(239,68,68,0.35)' }
                  : { background: 'white', color: '#94a3b8', border: '1.5px solid #e2e9fd' }}>
                <FiHeart fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Certifications */}
            {product.certifications?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.certifications.map(c => (
                  <span key={c} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(11,79,156,0.08)', color: '#0B4F9C', border: '1px solid rgba(11,79,156,0.15)' }}>
                    <FiShield className="w-3 h-3" /> {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-3xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(11,79,156,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
          {/* Tab bar */}
          <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid rgba(11,79,156,0.07)' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all duration-200 relative whitespace-nowrap"
                style={{ color: tab === t.id ? '#0B4F9C' : '#94a3b8' }}>
                {t.label}
                {tab === t.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: '#0B4F9C' }} />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-7 max-w-3xl">
            {tab === 'desc' && (
              <p className="text-slate-600 leading-relaxed">{product.description || 'No description available.'}</p>
            )}

            {tab === 'spec' && (
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(11,79,156,0.07)' }}>
                {[
                  ['Chemical Name', product.name],
                  ['CAS Number', product.casNumber],
                  ['Molecular Formula', product.molecularFormula],
                  ['Molecular Weight', product.molecularWeight],
                  ['Purity', product.purity],
                  ['Grade', product.grade],
                  ['Appearance', product.appearance],
                  ['Packaging Size', product.packagingSize],
                  ['HSN Code', product.hsn],
                  ['GST Rate', product.gstRate ? `${product.gstRate}%` : null],
                ].filter(([, v]) => v).map(([k, v], i) => (
                  <div key={k} className="flex items-center gap-4 px-5 py-3.5" style={{ background: i % 2 === 0 ? '#f8faff' : 'white', borderBottom: '1px solid rgba(11,79,156,0.05)' }}>
                    <span className="w-44 flex-shrink-0 text-xs font-bold uppercase tracking-wider text-slate-400">{k}</span>
                    <span className="text-sm font-semibold text-slate-700 font-mono">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'safe' && (
              <div className="space-y-4">
                {product.hazardClass && (
                  <div className="flex gap-4 p-5 rounded-2xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <FiAlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm text-amber-700 mb-1">Hazard Classification</div>
                      <p className="text-sm text-amber-600">{product.hazardClass}</p>
                    </div>
                  </div>
                )}
                {product.safetyData?.storageConditions && (
                  <div className="p-5 rounded-2xl" style={{ background: '#f8faff', border: '1px solid rgba(11,79,156,0.08)' }}>
                    <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2 mb-2"><FiInfo className="text-primary-500" /> Storage Conditions</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{product.safetyData.storageConditions}</p>
                  </div>
                )}
                {product.safetyData?.handlingPrecautions && (
                  <div className="p-5 rounded-2xl" style={{ background: '#f8faff', border: '1px solid rgba(11,79,156,0.08)' }}>
                    <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2 mb-2"><FiShield className="text-primary-500" /> Handling Precautions</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{product.safetyData.handlingPrecautions}</p>
                  </div>
                )}
                {product.safetyData?.ppe && (
                  <div className="p-5 rounded-2xl" style={{ background: '#f8faff', border: '1px solid rgba(11,79,156,0.08)' }}>
                    <h4 className="font-semibold text-sm text-slate-700 mb-2">PPE Required</h4>
                    <p className="text-sm text-slate-500">{product.safetyData.ppe}</p>
                  </div>
                )}
                {!product.hazardClass && !product.safetyData?.storageConditions && (
                  <p className="text-slate-400 text-sm">Safety data not available. Contact us for MSDS/SDS document.</p>
                )}
              </div>
            )}

            {tab === 'app' && (
              <div className="space-y-5">
                {product.industries?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-slate-700 mb-3">Industries</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.industries.map(ind => (
                        <span key={ind} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                          style={{ background: 'rgba(11,79,156,0.08)', color: '#0B4F9C', border: '1px solid rgba(11,79,156,0.15)' }}>
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {product.applications && (
                  <div className="p-5 rounded-2xl" style={{ background: '#f8faff', border: '1px solid rgba(11,79,156,0.08)' }}>
                    <h4 className="font-semibold text-sm text-slate-700 mb-2">Applications</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{product.applications}</p>
                  </div>
                )}
                {!product.industries?.length && !product.applications && (
                  <p className="text-slate-400 text-sm">No application details listed. Contact us for technical guidance.</p>
                )}
              </div>
            )}

            {tab === 'rev' && (
              <div className="space-y-5">
                {product.reviews?.length > 0 ? product.reviews.map((r, i) => (
                  <div key={i} className="p-5 rounded-2xl" style={{ background: '#f8faff', border: '1px solid rgba(11,79,156,0.07)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: 'linear-gradient(135deg,#0B4F9C,#1a70ff)' }}>{r.name[0]}</div>
                        <div>
                          <div className="font-semibold text-sm text-slate-800">{r.name}</div>
                          <div className="flex gap-0.5 mt-0.5">
                            {[1,2,3,4,5].map(s => <FiStar key={s} className="w-3 h-3" fill={s <= r.rating ? '#f59e0b' : 'none'} color={s <= r.rating ? '#f59e0b' : '#d1d5db'} />)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>
                  </div>
                )) : <p className="text-slate-400 text-sm">No reviews yet. Be the first to review!</p>}

                {user && (
                  <form onSubmit={handleReview} className="p-6 rounded-2xl mt-4"
                    style={{ border: '2px solid rgba(11,79,156,0.12)', background: 'rgba(11,79,156,0.02)' }}>
                    <h4 className="font-display font-bold text-slate-800 mb-4">Write a Review</h4>
                    <div className="flex gap-1 mb-4">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setReviewRating(s)} className="transition-transform hover:scale-125">
                          <FiStar className="w-6 h-6" fill={s <= reviewRating ? '#f59e0b' : 'none'} color={s <= reviewRating ? '#f59e0b' : '#d1d5db'} />
                        </button>
                      ))}
                    </div>
                    <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} rows={3} required
                      placeholder="Share your experience with this product…" className="input-field resize-none mb-4" />
                    <button type="submit" disabled={submitting} className="btn-primary">
                      <span>{submitting ? 'Submitting…' : 'Submit Review'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
