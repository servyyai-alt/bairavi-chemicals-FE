import { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Loader } from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { useAdminPanel } from '../../context/AdminPanelContext';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-primary-100 text-primary-700',
  cancelled: 'bg-red-100 text-red-700'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('');
  const { currentSearch } = useAdminPanel();

  const load = () => getAllOrders().then(r => { setOrders(r.data.orders); setLoading(false); });
  useEffect(() => { load(); }, []);

  const handleStatus = async (id, orderStatus) => {
    try {
      await updateOrderStatus(id, { orderStatus });
      toast.success('Status updated!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const keyword = currentSearch.trim().toLowerCase();
  const filtered = orders.filter(order => {
    const matchesStatus = filter ? order.orderStatus === filter : true;
    if (!matchesStatus) return false;
    if (!keyword) return true;

    const searchable = [
      order._id,
      order.user?.name,
      order.user?.phone,
      order.shippingAddress?.fullName,
      order.shippingAddress?.phone,
      order.orderStatus,
      ...(order.orderItems || []).map(item => item.name)
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchable.includes(keyword);
  });

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => setFilter('')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!filter ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All ({orders.length})</button>
          {STATUSES.map(s => {
            const count = orders.filter(o => o.orderStatus === s).length;
            return count > 0 ? (
              <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s} ({count})
              </button>
            ) : null;
          })}
        </div>

        {loading ? <Loader /> : filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-lg font-semibold text-gray-900">No matching orders found</p>
            <p className="mt-2 text-sm text-gray-500">Try another order ID, customer name, phone number, product name, or status.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => (
              <div key={order._id} className="card overflow-hidden">
                <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                      <p className="font-mono font-semibold text-gray-800">#{order._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Customer</p>
                      <p className="font-medium text-gray-900">{order.user?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Amount</p>
                      <p className="font-bold text-gray-900">₹{order.totalPrice}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Status</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.orderStatus]}`}>{order.orderStatus}</span>
                    </div>
                  </div>
                  <FiChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${expanded === order._id ? 'rotate-180' : ''}`} />
                </div>

                {expanded === order._id && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4 animate-slide-up">
                    {/* Order Items */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Items</p>
                      <div className="space-y-2">
                        {order.orderItems.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <img src={item.image || ''} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-white" />
                            <p className="text-sm text-gray-800 flex-1">{item.name} × {item.quantity}</p>
                            <p className="text-sm font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address + Update Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Shipping Address</p>
                        <p className="text-sm text-gray-700">{order.shippingAddress.fullName}</p>
                        <p className="text-sm text-gray-600">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                        <p className="text-sm text-gray-600">{order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Update Status</p>
                        <select
                          value={order.orderStatus}
                          onChange={e => handleStatus(order._id, e.target.value)}
                          disabled={order.orderStatus === 'cancelled'}
                          className="input-field text-sm py-2 bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          {order.orderStatus === 'cancelled' && (
                            <option value="cancelled">Cancelled</option>
                          )}
                          {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                        {order.orderStatus === 'cancelled' && (
                          <p className="mt-2 text-xs text-red-500">This order was cancelled by the user and can no longer be changed.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
