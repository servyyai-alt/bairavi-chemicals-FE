import { useState } from 'react';
import { FiUser, FiLock, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import { updateProfile, changePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [tab, setTab] = useState('profile');

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

        <div>
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
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          ['profile', <FiUser className="w-4 h-4" />, 'Profile Info'],
          ['password', <FiLock className="w-4 h-4" />, 'Change Password']
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
    </div>
  );
}