import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi';
import { getOrderById } from '../services/api';
import { Loader } from '../components/common/Loader';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id).then(r => { setOrder(r.data.order); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader size="lg" />;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
      <div className="card p-10">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="w-10 h-10 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-1">Thank you for shopping with FreshMart 🌿</p>
        <p className="text-sm text-gray-400 mb-8">Order ID: <span className="font-mono font-semibold text-gray-700">{order._id}</span></p>

        {/* Order Items */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left space-y-3">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <img src={item.image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=80'} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-white" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
              </div>
              <span className="font-semibold text-sm">₹{(item.price * item.quantity).toFixed(0)}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left text-sm space-y-2">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.itemsPrice}</span></div>
          <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
          <div className="flex justify-between text-gray-600"><span>Tax</span><span>₹{order.taxPrice}</span></div>
          <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-2"><span>Total Paid</span><span>₹{order.totalPrice}</span></div>
        </div>

        {/* Delivery Address */}
        <div className="bg-primary-50 rounded-2xl p-5 mb-8 text-left">
          <p className="font-semibold text-gray-900 mb-1 text-sm">Delivering to:</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          <p className="text-sm text-gray-600">📞 {order.shippingAddress.phone}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/orders" className="btn-outline flex items-center justify-center gap-2 flex-1">
            <FiPackage /> Track Orders
          </Link>
          <Link to="/" className="btn-primary flex items-center justify-center gap-2 flex-1">
            <FiHome /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
