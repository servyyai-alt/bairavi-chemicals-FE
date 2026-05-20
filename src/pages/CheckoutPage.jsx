import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { createOrder, verifyPayment, getStoreSettings } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[data-razorpay-checkout="true"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Razorpay SDK failed to load')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
    document.body.appendChild(script);
  });

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [storeSettings, setStoreSettings] = useState({
    gstPercentage: 18,
    shippingCharge: 49,
    freeShippingAbove: 499,
    codAvailable: true
  });
  const [address, setAddress] = useState({
    fullName: user?.name || '', phone: user?.phone || '',
    street: user?.address?.street || '', city: user?.address?.city || '',
    state: user?.address?.state || '', pincode: user?.address?.pincode || ''
  });

  useEffect(() => {
    getStoreSettings()
      .then(({ data }) => {
        const settings = data.settings || {};
        const normalized = {
          gstPercentage: Number(settings.gstPercentage ?? 18),
          shippingCharge: Number(settings.shippingCharge ?? 49),
          freeShippingAbove: Number(settings.freeShippingAbove ?? 499),
          codAvailable: Boolean(settings.codAvailable ?? true)
        };
        setStoreSettings(normalized);
        if (!normalized.codAvailable) {
          setPaymentMethod('razorpay');
        }
      })
      .catch(() => {});
  }, []);

  const shipping = cart.totalAmount >= Number(storeSettings.freeShippingAbove || 0)
    ? 0
    : Number(storeSettings.shippingCharge || 0);
  const tax = Math.round(cart.totalAmount * (Number(storeSettings.gstPercentage || 0) / 100));
  const total = cart.totalAmount + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderItems = cart.items.map(item => ({
        product: item.product._id,
        selectedSize: item.selectedSize,
        quantity: item.quantity
      }));

      const { data } = await createOrder({
        orderItems,
        shippingAddress: address,
        paymentMethod
      });

      if (paymentMethod === 'razorpay') {
        await loadRazorpayScript();

        if (!data?.razorpayOrder?.id || !data?.key) {
          throw new Error('Razorpay order details are missing');
        }

        const options = {
          key: data.key,
          amount: data.razorpayOrder.amount,
          currency: 'INR',
          name: 'Sri Bairavi Chemicals',
          description: 'Chemical Order Payment',
          order_id: data.razorpayOrder.id,
          handler: async (response) => {
            try {
              await verifyPayment({ orderId: data.order._id, ...response });
              clearCart();
              navigate(`/order-confirmation/${data.order._id}`);
            } catch { toast.error('Payment verification failed'); }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            }
          },
          prefill: { name: address.fullName, contact: address.phone, email: user?.email },
          theme: { color: '#16a34a' }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      } else {
        clearCart();
        navigate(`/order-confirmation/${data.order._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
    setLoading(false);
  };

  const updateAddress = (key, val) => setAddress(a => ({ ...a, [key]: val }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <FiLock className="text-primary-600" /> Secure Checkout
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Address + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="card p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-5">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'fullName', label: 'Full Name', col: 1 },
                  { key: 'phone', label: 'Phone Number', col: 1 },
                  { key: 'street', label: 'Street Address', col: 2 },
                  { key: 'city', label: 'City', col: 1 },
                  { key: 'state', label: 'State', col: 1 },
                  { key: 'pincode', label: 'Pincode', col: 1 }
                ].map(f => (
                  <div key={f.key} className={f.col === 2 ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                    <input
                      type="text" required value={address[f.key]}
                      onChange={e => updateAddress(f.key, e.target.value)}
                      className="input-field"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-5">Payment Method</h2>
              <div className="space-y-3">
                {[
                  ...(storeSettings.codAvailable ? [{ value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' }] : []),
                  { value: 'razorpay', label: 'Online Payment', icon: '💳', desc: 'Cards, UPI, Netbanking via Razorpay' }
                ].map(m => (
                  <label key={m.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === m.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} className="sr-only" />
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{m.label}</p>
                      <p className="text-sm text-gray-500">{m.desc}</p>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === m.value ? 'border-primary-600' : 'border-gray-300'}`}>
                      {paymentMethod === m.value && <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="font-bold text-lg text-gray-900 mb-5">Order Summary</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto mb-5">
                {cart.items?.map(item => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img src={item.product?.images?.[0] || ''} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.product?.name}</p>
                      <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{cart.totalAmount?.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping === 0 ? 'text-primary-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax ({storeSettings.gstPercentage || 0}%)</span><span>₹{tax}</span></div>
                <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2 mt-2">
                  <span>Total</span><span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button type="submit" disabled={loading || !cart.items?.length} className="btn-primary w-full py-3 mt-5 text-base flex items-center justify-center gap-2">
                {loading ? 'Placing Order...' : `Place Order • ₹${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
