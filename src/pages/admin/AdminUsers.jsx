import { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Loader } from '../../components/common/Loader';
import { useAdminPanel } from '../../context/AdminPanelContext';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currentSearch } = useAdminPanel();

  const load = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const keyword = currentSearch.trim().toLowerCase();

  const filtered = users.filter(
    (u) =>
      u.role?.toLowerCase().trim() !== 'admin' &&
      (!keyword ||
        [u.name, u.email, u.phone]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(keyword))
  );

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fade-in">
        {loading ? (
          <Loader />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                {/* Table Header */}
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['User', 'Email', 'Phone', 'Joined'].map((heading) => (
                      <th
                        key={heading}
                        className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-6 text-gray-400"
                      >
                        No matching users found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        {/* User */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {user.name?.[0]?.toUpperCase() || 'U'}
                            </div>

                            <span className="font-medium text-gray-900">
                              {user.name}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-3 px-4 text-gray-500">
                          {user.email}
                        </td>

                        {/* Phone */}
                        <td className="py-3 px-4 text-gray-500">
                          {user.phone || '—'}
                        </td>

                        {/* Joined Date */}
                        <td className="py-3 px-4 text-gray-500">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                'en-IN'
                              )
                            : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}