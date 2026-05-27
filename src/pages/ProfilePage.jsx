import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiLock, FiSave, FiEye, FiEyeOff, FiPackage, FiChevronRight } from 'react-icons/fi';
import { updateProfile, changePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getMyOrders } from '../services/api';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-primary-100 text-primary-700',
  cancelled: 'bg-red-100 text-red-700'
};

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || ''
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyOrders()
      .then(({ data }) => {
        setOrders(data.orders || []);
      })
      .catch(() => {
        setOrders([]);
      })
      .finally(() => {
        setOrdersLoading(false);
      });
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode
        }
      });

      await refreshUser();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }

    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSaving(true);

    try {
      await changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });

      toast.success('Password changed!');

      setPwForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }

    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        My Profile
      </h1>

      {/* User card */}
      <div className="card p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
          {user?.name?.[0]?.toUpperCase()}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">
            {user?.name}
          </h2>

          <p className="text-gray-500 text-sm">
            {user?.email}
          </p>

          <span className="inline-block mt-1 text-xs bg-primary-100 text-primary-700 font-semibold px-2.5 py-0.5 rounded-full capitalize">
            {user?.role}
          </span>
        </div>

        <div className="hidden md:grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gray-50 px-4 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Orders</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{orders.length}</p>
          </div>
          {/* <div className="rounded-2xl bg-gray-50 px-4 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Order Status</p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {orders.filter(order => !['delivered', 'cancelled'].includes(order.orderStatus)).length}
            </p>
          </div> */}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          ['profile', <FiUser className="w-4 h-4" />, 'Profile Info'],
          ['password', <FiLock className="w-4 h-4" />, 'Change Password'],
          ['orders', <FiPackage className="w-4 h-4" />, 'My Orders']
        ].map(([key, icon, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tab === key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="card p-6">
          <form onSubmit={handleProfileSave} className="space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={e =>
                    setForm(f => ({
                      ...f,
                      name: e.target.value
                    }))
                  }
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone
                </label>

                <input
                  type="text"
                  value={form.phone}
                  onChange={e =>
                    setForm(f => ({
                      ...f,
                      phone: e.target.value
                    }))
                  }
                  className="input-field"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Street Address
                </label>

                <input
                  type="text"
                  value={form.street}
                  onChange={e =>
                    setForm(f => ({
                      ...f,
                      street: e.target.value
                    }))
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  City
                </label>

                <input
                  type="text"
                  value={form.city}
                  onChange={e =>
                    setForm(f => ({
                      ...f,
                      city: e.target.value
                    }))
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  State
                </label>

                <input
                  type="text"
                  value={form.state}
                  onChange={e =>
                    setForm(f => ({
                      ...f,
                      state: e.target.value
                    }))
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Pincode
                </label>

                <input
                  type="text"
                  value={form.pincode}
                  onChange={e =>
                    setForm(f => ({
                      ...f,
                      pincode: e.target.value
                    }))
                  }
                  className="input-field"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <FiSave />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

          </form>
        </div>
      )}

      {/* Password Tab */}
      {tab === 'password' && (
        <div className="card p-6">

          <form
            onSubmit={handlePasswordChange}
            className="space-y-5 max-w-md"
          >

            {[
              ['currentPassword', 'Current Password'],
              ['newPassword', 'New Password'],
              ['confirmPassword', 'Confirm New Password']
            ].map(([key, label]) => (

              <div key={key}>

                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {label}
                </label>

                <div className="relative">

                  <input
                    type={showPassword[key] ? 'text' : 'password'}
                    value={pwForm[key]}
                    onChange={e =>
                      setPwForm(f => ({
                        ...f,
                        [key]: e.target.value
                      }))
                    }
                    className="input-field pr-10"
                    required
                    minLength={6}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(prev => ({
                        ...prev,
                        [key]: !prev[key]
                      }))
                    }
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword[key] ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>

                </div>

              </div>
            ))}

            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <FiLock />
              {saving ? 'Updating...' : 'Change Password'}
            </button>

          </form>
        </div>
      )}

      {tab === 'orders' && (
        <div className="card p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Purchased Products & Order Status</h2>
              <p className="text-sm text-gray-500">See everything you bought and the latest order status.</p>
            </div>
            <Link to="/orders" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              View Full Orders
            </Link>
          </div>

          {ordersLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl bg-gray-50 px-5 py-10 text-center">
              <p className="text-lg font-bold text-gray-800">No orders yet</p>
              <p className="mt-2 text-sm text-gray-500">Once the user buys products, they will appear here with full status.</p>
              <Link to="/products" className="btn-primary inline-flex mt-5">
                Shop Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-mono text-sm font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="mt-1 text-xs text-gray-500">
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
                      <Link to={`/orders/${order._id}`} className="text-primary-600 hover:text-primary-700">
                        <FiChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.orderItems.map((item, index) => (
                      <div key={`${order._id}-${index}`} className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=80'}
                          alt={item.name}
                          className="h-14 w-14 rounded-xl bg-white object-contain p-1"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</p>
                          <p className="text-xs text-gray-500">{order.paymentMethod.toUpperCase()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <p className="text-sm text-gray-500">
                      {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''} purchased
                    </p>
                    <p className="text-base font-bold text-gray-900">Total: ₹{order.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
