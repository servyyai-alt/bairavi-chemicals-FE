import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBox,
  FiCheckCircle,
  FiChevronRight,
  FiPackage,
  FiShoppingBag,
  FiStar,
  FiTruck,
  FiXCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { cancelMyOrder, getMyOrders } from '../services/api';
import { Loader } from '../components/common/Loader';
import RatingPopup from '../components/common/RatingPopup';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-primary-100 text-primary-700',
  cancelled: 'bg-red-100 text-red-700'
};

const ORDER_STEPS = [
  { key: 'pending', label: 'Order Placed', Icon: FiShoppingBag },
  { key: 'confirmed', label: 'Confirmed', Icon: FiBox },
  { key: 'shipped', label: 'Shipped', Icon: FiTruck },
  { key: 'delivered', label: 'Delivered', Icon: FiCheckCircle }
];

const STATUS_TO_STEP_INDEX = {
  pending: 0,
  confirmed: 1,
  processing: 1,
  shipped: 2,
  delivered: 3
};

const CANCELLABLE_STATUSES = ['pending', 'confirmed', 'processing'];

function OrderStatusTracker({ status }) {
  if (status === 'cancelled') {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
        <p className="text-sm font-semibold capitalize text-red-700">Order cancelled</p>
        <p className="mt-1 text-xs text-red-600">This order is no longer being processed.</p>
      </div>
    );
  }

  const activeStepIndex = STATUS_TO_STEP_INDEX[status] ?? 0;

  return (
    <div className="rounded-2xl bg-sky-50/70 px-4 py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {ORDER_STEPS.map((step, index) => {
          const isCompleted = index <= activeStepIndex;
          const isCurrent = index === activeStepIndex;
          const isLast = index === ORDER_STEPS.length - 1;

          return (
            <div key={step.key} className="relative flex md:flex-1 md:flex-col md:items-center">
              <div className="hidden items-center text-center md:flex md:flex-col">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                    isCompleted
                      ? 'border-green-200 bg-green-100 text-green-700'
                      : 'border-gray-200 bg-white text-gray-300'
                  } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}
                >
                  <step.Icon className="h-5 w-5" />
                </div>

                <p className={`mt-2 text-xs font-semibold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                  {step.label}
                </p>

                {!isLast && (
                  <div className="absolute top-6 left-[60%] h-1 w-full bg-gray-200">
                    <div
                      className={`h-full bg-green-400 transition-all ${index < activeStepIndex ? 'w-full' : 'w-0'}`}
                    />
                  </div>
                )}
              </div>

              <div className="relative flex w-full items-center py-3 md:hidden">
                <p className={`w-20 pr-2 text-right text-xs font-semibold ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  {step.label}
                </p>

                <div
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white ${
                    isCompleted ? 'border-green-500 text-green-700' : 'border-gray-200 text-gray-300'
                  } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}
                >
                  <step.Icon className="h-5 w-5" />
                </div>

                {!isLast && (
                  <div className="absolute left-1/2 top-12 h-14 w-0.5 -translate-x-1/2 bg-gray-200">
                    <div
                      className={`w-0.5 bg-green-500 transition-all ${index < activeStepIndex ? 'h-full' : 'h-0'}`}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingPopup, setShowRatingPopup] = useState(null);
  const [cancellingId, setCancellingId] = useState('');

  useEffect(() => {
    getMyOrders()
      .then(response => {
        setOrders(response.data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCancelOrder = async orderId => {
    if (!confirm('Cancel this order?')) return;

    setCancellingId(orderId);
    try {
      const { data } = await cancelMyOrder(orderId);
      setOrders(current => current.map(order => (order._id === orderId ? data.order : order)));
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingId('');
    }
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="mx-auto max-w-4xl animate-fade-in px-4 py-8">
      <h1 className="mb-8 flex items-center gap-3 text-2xl font-bold text-gray-900">
        <FiPackage className="text-primary-600" /> My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mb-6 text-7xl">No orders</div>
          <h2 className="mb-3 text-2xl font-bold text-gray-800">No orders yet</h2>
          <p className="mb-6 text-gray-500">Start shopping to see your orders here</p>
          <Link to="/products" className="btn-primary">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card p-5 transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                  <Link to={`/orders/${order._id}`} className="text-primary-600 transition-colors hover:text-primary-700">
                    <FiChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              <div className="mb-4">
                <OrderStatusTracker status={order.orderStatus} />
              </div>

              <div className="mb-4 flex items-center gap-3 overflow-x-auto pb-2">
                {order.orderItems.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex-shrink-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=80'}
                      alt={item.name}
                      className="h-14 w-14 rounded-xl bg-gray-100 object-cover"
                    />
                  </div>
                ))}

                {order.orderItems.length > 4 && (
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-500">
                    +{order.orderItems.length - 4}
                  </div>
                )}
              </div>

              {order.orderStatus === 'delivered' && (
                <div className="mb-4 space-y-2">
                  {order.orderItems.map((item, index) => {
                    const product = item.product;
                    const canRate = product && typeof product !== 'string';

                    return (
                      <div
                        key={`${order._id}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>

                        {canRate && (
                          <button
                            onClick={() => setShowRatingPopup(product)}
                            className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 transition hover:bg-yellow-200"
                          >
                            <FiStar className="h-3 w-3" /> Rate
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-500">
                  {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''} · {order.paymentMethod.toUpperCase()}
                </p>

                <div className="flex items-center gap-3">
                  {CANCELLABLE_STATUSES.includes(order.orderStatus) && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingId === order._id}
                      className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiXCircle className="h-3.5 w-3.5" />
                      {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}

                  <p className="text-base font-bold text-gray-900">Rs {order.totalPrice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showRatingPopup && <RatingPopup product={showRatingPopup} onClose={() => setShowRatingPopup(null)} />}
    </div>
  );
}
