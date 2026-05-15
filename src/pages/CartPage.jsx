import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = cart.totalAmount > 499 ? 0 : 49;
  const tax = Math.round(cart.totalAmount * 0.05);
  const total = cart.totalAmount + shipping + tax;

  if (!cart.items?.length) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-7xl mb-6">🛒</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some fresh products to your cart</p>
      <Link to="/products" className="btn-primary flex items-center gap-2">
        <FiShoppingBag /> Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
  
  {/* First Line - Heading */}
  <h1 className="text-2xl font-bold text-gray-900">
    Shopping Cart
    <span className="text-gray-400 font-normal text-lg ml-2">
      ({cart.items.length} items)
    </span>
  </h1>

  {/* Second Line - Button */}
  <div className="flex justify-start md:justify-end">
    <button
      onClick={clearCart}
      className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1.5"
    >
      <FiTrash2 className="w-4 h-4" /> Clear Cart
    </button>
  </div>

</div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <div
  key={item._id}
  className="card p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4"
>
  {/* Top Section */}
  <div className="flex items-center gap-3 flex-1 min-w-0">
    <img
      src={
        item.product?.images?.[0] ||
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200"
      }
      alt={item.product?.name}
      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
    />

    <div className="flex-1 min-w-0">
      <Link
        to={`/products/${item.product?.slug || "#"}`}
        className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 text-sm sm:text-base"
      >
        {item.product?.name}
      </Link>

      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
        ₹{item.price} / {item.product?.unit}
      </p>

      <p className="text-primary-600 font-bold mt-1 text-sm sm:text-base">
        ₹{(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  </div>

  {/* Bottom Controls */}
  <div className="flex items-center justify-between sm:justify-end gap-3">
    
    {/* Quantity */}
    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => updateItem(item._id, item.quantity - 1)}
        className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
      >
        <FiMinus className="w-3.5 h-3.5" />
      </button>

      <span className="px-4 font-semibold text-sm">
        {item.quantity}
      </span>

      <button
        onClick={() => updateItem(item._id, item.quantity + 1)}
        className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
      >
        <FiPlus className="w-3.5 h-3.5" />
      </button>
    </div>

    {/* Delete */}
    <button
      onClick={() => removeItem(item._id)}
      className="text-gray-400 hover:text-red-500 transition-colors p-2"
    >
      <FiTrash2 className="w-4 h-4" />
    </button>
  </div>
</div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-lg text-gray-900 mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.items.length} items)</span>
                <span>₹{cart.totalAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-primary-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (5%)</span>
                <span>₹{tax}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-accent-500 bg-accent-50 rounded-lg px-3 py-2">
                  Add ₹{(499 - cart.totalAmount).toFixed(0)} more for free shipping!
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base">
              Proceed to Checkout <FiArrowRight />
            </button>
            <Link to="/products" className="block text-center text-sm text-primary-600 font-medium mt-4 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
