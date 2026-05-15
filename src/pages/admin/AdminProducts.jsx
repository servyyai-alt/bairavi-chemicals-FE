import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiUpload } from 'react-icons/fi';
import {
  getAllProductsAdmin, getAllCategoriesAdmin, createProduct, updateProduct, deleteProduct, uploadImage
} from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminPanel } from '../../context/AdminPanelContext';

const EMPTY = {
  name: '', description: '', price: '', originalPrice: '', stock: '', unit: 'kg', category: '',
  casNumber: '', purity: '', grade: 'industrial', packagingSize: '', molecularFormula: '',
  molecularWeight: '', appearance: '', hsn: '', gstRate: 18, hazardClass: '',
  storageConditions: '', handlingPrecautions: '', ppe: '', industries: '', applications: '',
  certifications: '', minOrderQty: 1, isFeatured: false, isActive: true
};

const GRADES = ['industrial','laboratory','analytical','pharmaceutical','food','reagent','technical'];
const UNITS  = ['kg','g','litre','ml','ton','bag','drum','can','bottle','pack'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const { currentSearch } = useAdminPanel();

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([getAllProductsAdmin(), getAllCategoriesAdmin()]);
      setProducts(pRes.data.products || []);
      setCategories(cRes.data.categories || []);
    } catch { toast.error('Failed to load data'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setImages([]); setModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      ...EMPTY, ...p,
      category: p.category?._id || p.category || '',
      industries: (p.industries || []).join(', '),
      certifications: (p.certifications || []).join(', '),
      storageConditions: p.safetyData?.storageConditions || '',
      handlingPrecautions: p.safetyData?.handlingPrecautions || '',
      ppe: p.safetyData?.ppe || '',
    });
    setImages(p.images || []);
    setModal(true);
  };

  const handleImgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadImage(file);
      setImages(prev => [...prev, data.url]);
    } catch { toast.error('Image upload failed'); }
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        images,
        industries: form.industries ? form.industries.split(',').map(s => s.trim()).filter(Boolean) : [],
        certifications: form.certifications ? form.certifications.split(',').map(s => s.trim()).filter(Boolean) : [],
        safetyData: { storageConditions: form.storageConditions, handlingPrecautions: form.handlingPrecautions, ppe: form.ppe }
      };
      if (editing) await updateProduct(editing._id, payload);
      else await createProduct(payload);
      toast.success(editing ? 'Product updated!' : 'Product created!');
      setModal(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await deleteProduct(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const keyword = (currentSearch || search).trim().toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(keyword) ||
    (p.casNumber || '').toLowerCase().includes(keyword)
  );

  return (
    <AdminLayout>
      <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-chem-text font-display">Chemical Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} products in catalogue</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><FiPlus /> Add Product</button>
      </div>

      {/* Search */}
      <div className="card p-4 mb-6">
        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or CAS number…"
            className="w-full pl-10 pr-4 py-2.5 bg-chem-bg border border-chem-gray rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-chem-bg border-b border-gray-100">
              <tr>
                {['Product','CAS Number','Category','Price','Stock','Grade','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">No products found</td></tr>
              ) : filtered.map(p => (
                <tr key={p._id} className="hover:bg-chem-bg transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=60&q=80'}
                        alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <div className="font-semibold text-chem-text leading-tight">{p.name}</div>
                        {p.purity && <div className="text-xs text-gray-400">Purity: {p.purity}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.casNumber || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-primary-700">₹{p.price?.toLocaleString('en-IN')}<span className="text-gray-400 font-normal text-xs">/{p.unit}</span></td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.stock > 0 ? 'badge-green' : 'badge-red'}`}>{p.stock} {p.unit}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge badge-blue capitalize">{p.grade}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.isActive ? 'badge-green' : 'badge-gray'}`}>{p.isActive ? 'Active' : 'Hidden'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 flex items-center justify-center transition-colors">
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-6 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-display font-bold text-lg">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Basic */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Basic Info</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Product Name *</label>
                    <input required value={form.name} onChange={f('name')} className="input-field" placeholder="e.g. Sodium Chloride" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Category *</label>
                    <select required value={form.category} onChange={f('category')} className="input-field">
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Description *</label>
                  <textarea required value={form.description} onChange={f('description')} rows={3} className="input-field resize-none" placeholder="Product description…" />
                </div>
              </div>

              {/* Chemical specs */}
              <div className="space-y-4 pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Chemical Specifications</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    ['CAS Number','casNumber','7647-14-5'],
                    ['Purity','purity','99.5%'],
                    ['Molecular Formula','molecularFormula','NaCl'],
                    ['Molecular Weight','molecularWeight','58.44 g/mol'],
                    ['Appearance','appearance','White crystalline powder'],
                    ['Packaging Size','packagingSize','25 kg bag, 50 kg bag'],
                    ['HSN Code','hsn','28272000'],
                    ['Hazard Class','hazardClass','Non-hazardous'],
                  ].map(([label, key, ph]) => (
                    <div key={key}>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
                      <input value={form[key]} onChange={f(key)} placeholder={ph} className="input-field" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Grade</label>
                    <select value={form.grade} onChange={f('grade')} className="input-field">
                      {GRADES.map(g => <option key={g} value={g} className="capitalize">{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Unit</label>
                    <select value={form.unit} onChange={f('unit')} className="input-field">
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4 pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Pricing & Inventory</p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Price (₹) *</label>
                    <input required type="number" value={form.price} onChange={f('price')} className="input-field" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Original Price (₹)</label>
                    <input type="number" value={form.originalPrice} onChange={f('originalPrice')} className="input-field" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">GST Rate (%)</label>
                    <input type="number" value={form.gstRate} onChange={f('gstRate')} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Stock *</label>
                    <input required type="number" value={form.stock} onChange={f('stock')} className="input-field" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Min Order Qty</label>
                    <input type="number" value={form.minOrderQty} onChange={f('minOrderQty')} className="input-field" />
                  </div>
                </div>
              </div>

              {/* Safety */}
              <div className="space-y-4 pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Safety Data</p>
                {[
                  ['Storage Conditions','storageConditions'],
                  ['Handling Precautions','handlingPrecautions'],
                  ['PPE Required','ppe'],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
                    <input value={form[key]} onChange={f(key)} className="input-field" placeholder={label} />
                  </div>
                ))}
              </div>

              {/* Applications */}
              <div className="space-y-4 pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Applications & Certifications</p>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Industries (comma separated)</label>
                  <input value={form.industries} onChange={f('industries')} className="input-field" placeholder="Textile, Water Treatment, Pharma" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Applications</label>
                  <textarea value={form.applications} onChange={f('applications')} rows={2} className="input-field resize-none" placeholder="Used in…" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Certifications (comma separated)</label>
                  <input value={form.certifications} onChange={f('certifications')} className="input-field" placeholder="ISO 9001, GMP, FSSAI" />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Product Images</p>
                <div className="flex flex-wrap gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16">
                      <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                      <button type="button" onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">×</button>
                    </div>
                  ))}
                  <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 transition-colors">
                    <FiUpload className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400 mt-0.5">Upload</span>
                    <input type="file" accept="image/*" onChange={handleImgUpload} className="hidden" />
                  </label>
                  {uploading && <div className="w-16 h-16 rounded-xl bg-gray-200 animate-pulse" />}
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-6 pt-1">
                {[['isFeatured','Featured Product'],['isActive','Active / Visible']].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[key]} onChange={f(key)} className="w-4 h-4 accent-primary-600" />
                    <span className="text-sm text-gray-600">{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : editing ? 'Update Product' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
}
