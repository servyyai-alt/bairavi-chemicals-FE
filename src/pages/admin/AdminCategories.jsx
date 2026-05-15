import { useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { Loader } from '../../components/common/Loader';
import { useAdminPanel } from '../../context/AdminPanelContext';
import { createCategory, deleteCategory, getAllCategoriesAdmin, getCategories, updateCategory } from '../../services/api';

const EMPTY = {
  name: '',
  description: '',
  icon: 'Cart',
  image: '',
  sortOrder: 0,
  isActive: true
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const { currentSearch } = useAdminPanel();

  const load = async () => {
    setLoading(true);

    try {
      const response = await getAllCategoriesAdmin();
      setCategories(response.data.categories || []);
    } catch (err) {
      try {
        const fallback = await getCategories({ includeInactive: true });
        setCategories(fallback.data.categories || []);
        toast.error('Admin categories endpoint is not available yet. Showing fallback list.');
      } catch {
        setCategories([]);
        toast.error(err.response?.data?.message || 'Failed to load categories');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setModal(true);
  };

  const openEdit = category => {
    setEditing(category._id);
    setForm({
      name: category.name || '',
      description: category.description || '',
      icon: category.icon || 'Cart',
      image: category.image || '',
      sortOrder: category.sortOrder ?? 0,
      isActive: category.isActive !== false
    });
    setModal(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        sortOrder: Number(form.sortOrder || 0)
      };

      if (editing) {
        await updateCategory(editing, payload);
        toast.success('Category updated');
      } else {
        await createCategory(payload);
        toast.success('Category created');
      }

      setModal(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this category?')) return;

    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleStatusToggle = async category => {
    try {
      await updateCategory(category._id, { isActive: !category.isActive });
      toast.success(category.isActive ? 'Category marked inactive' : 'Category marked active');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category status');
    }
  };

  const keyword = currentSearch.trim().toLowerCase();
  const filtered = categories.filter(category => {
    if (!keyword) return true;

    return [category.name, category.description, category.isActive ? 'active' : 'inactive']
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(keyword);
  });

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total categories: <span className="font-semibold text-gray-900">{categories.length}</span>
            </p>
            {filtered.length !== categories.length && (
              <p className="text-xs text-gray-400">
                Showing {filtered.length} of {categories.length} categories
              </p>
            )}
          </div>

          <button onClick={openCreate} className="btn-primary flex items-center gap-2 py-2 text-sm">
            <FiPlus /> Add Category
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-lg font-semibold text-gray-900">No matching records found</p>
            <p className="mt-2 text-sm text-gray-500">Try another category name, description, or status keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(category => (
              <div key={category._id} className="card p-5">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{category.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-gray-900">{category.name}</p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          category.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">{category.description || 'No description'}</p>
                    <p className="mt-2 text-xs text-gray-400">Sort Order: {category.sortOrder ?? 0}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => openEdit(category)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                  >
                    <FiEdit2 className="h-3.5 w-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => handleStatusToggle(category)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium ${
                      category.isActive
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {category.isActive ? 'Mark Inactive' : 'Mark Active'}
                  </button>

                  <button
                    onClick={() => handleDelete(category._id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-100"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white">
            <div className="border-b border-gray-100 p-6">
              <h2 className="text-lg font-bold">{editing ? 'Edit Category' : 'New Category'}</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4 p-6">
              {[
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'icon', label: 'Icon', type: 'text' },
                { key: 'description', label: 'Description', type: 'text' },
                { key: 'image', label: 'Image URL', type: 'text' },
                { key: 'sortOrder', label: 'Sort Order', type: 'number' }
              ].map(field => (
                <div key={field.key}>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={e => setForm(current => ({ ...current, [field.key]: e.target.value }))}
                    required={field.key === 'name'}
                    className="input-field"
                  />
                </div>
              ))}

              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={!!form.isActive}
                  onChange={e => setForm(current => ({ ...current, isActive: e.target.checked }))}
                  className="h-4 w-4 accent-primary-600"
                />
                Active
              </label>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModal(false)} className="btn-outline flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
