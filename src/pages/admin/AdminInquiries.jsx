import { useEffect, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { Loader } from '../../components/common/Loader';
import { useAdminPanel } from '../../context/AdminPanelContext';
import { getAllInquiries, updateInquiryStatus } from '../../services/api';

const STATUSES = ['new', 'contacted', 'closed'];
const STATUS_STYLES = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  closed: 'bg-emerald-100 text-emerald-700'
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('');
  const { currentSearch } = useAdminPanel();

  const load = async () => {
    const response = await getAllInquiries();
    setInquiries(response.data.inquiries || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateInquiryStatus(id, { status });
      toast.success('Inquiry status updated');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update inquiry');
    }
  };

  const keyword = currentSearch.trim().toLowerCase();
  const filtered = inquiries.filter((inquiry) => {
    const matchesStatus = filter ? inquiry.status === filter : true;
    if (!matchesStatus) return false;
    if (!keyword) return true;

    const searchable = [
      inquiry.name,
      inquiry.email,
      inquiry.phone,
      inquiry.subject,
      inquiry.message,
      inquiry.status
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchable.includes(keyword);
  });

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fade-in px-4 py-6">
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => setFilter('')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!filter ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All ({inquiries.length})</button>
          {STATUSES.map((status) => {
            const count = inquiries.filter((inquiry) => inquiry.status === status).length;
            return count > 0 ? (
              <button key={status} onClick={() => setFilter(status)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === status ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {status} ({count})
              </button>
            ) : null;
          })}
        </div>

        {loading ? <Loader /> : filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-lg font-semibold text-gray-900">No matching inquiries found</p>
            <p className="mt-2 text-sm text-gray-500">Try another name, email, phone number, subject, or inquiry status.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((inquiry) => (
              <div key={inquiry._id} className="card overflow-hidden">
                <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpanded(expanded === inquiry._id ? null : inquiry._id)}>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Name</p>
                      <p className="font-medium text-gray-900">{inquiry.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Email</p>
                      <p className="font-medium text-gray-700 break-all">{inquiry.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Received</p>
                      <p className="font-medium text-gray-700">{formatDate(inquiry.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Status</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[inquiry.status]}`}>{inquiry.status}</span>
                    </div>
                  </div>
                  <FiChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${expanded === inquiry._id ? 'rotate-180' : ''}`} />
                </div>

                {expanded === inquiry._id && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Phone</p>
                          <p className="text-sm text-gray-700">{inquiry.phone || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Subject</p>
                          <p className="text-sm text-gray-700">{inquiry.subject || 'General inquiry'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Update Status</p>
                        <select
                          value={inquiry.status}
                          onChange={(e) => handleStatus(inquiry._id, e.target.value)}
                          className="input-field text-sm py-2 bg-white"
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status} className="capitalize">
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Message</p>
                      <div className="rounded-2xl bg-white border border-gray-100 p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {inquiry.message}
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
