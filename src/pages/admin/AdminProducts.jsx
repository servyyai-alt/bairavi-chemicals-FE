import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiUpload } from 'react-icons/fi';
import {
  getAllProductsAdmin, getAllCategoriesAdmin, createProduct, updateProduct, deleteProduct, uploadImage
} from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminPanel } from '../../context/AdminPanelContext';

const VARIANT_OPTIONS = ['500 ml', '1 Litre', '2 Litre', '5 Litre', '7 Litre', '10 Litre', '20 Litre', '50 Litre'];

const createVariantState = () => Object.fromEntries(
  VARIANT_OPTIONS.map((size) => [size, { enabled: false, price: '', offerPrice: '', stock: '', moq: '1' }])
);

const createEmptyForm = () => ({
  name: '',
  category: '',
  shortDescription: '',
  longDescription: '',
  sku: '',
  brandName: 'Sri Bairavi Chemicals',
  color: '',
  fragranceType: '',
  productType: '',
  shelfLife: '',
  storageCondition: '',
  ingredients: '',
  isFeatured: false,
  isActive: true,
  variants: createVariantState()
});

const getDisplayPrice = (product) => {
  const defaultVariant = product.variants?.find((variant) => variant.stock > 0) || product.variants?.[0];
  if (defaultVariant) {
    return defaultVariant.offerPrice > 0 && defaultVariant.offerPrice < defaultVariant.price
      ? defaultVariant.offerPrice
      : defaultVariant.price;
  }

  return product.price;
};

const buildVariantStateFromProduct = (product) => {
  const nextState = createVariantState();

  (product.variants || []).forEach((variant) => {
    if (!nextState[variant.size]) return;
    nextState[variant.size] = {
      enabled: true,
      price: String(variant.price ?? ''),
      offerPrice: String(variant.offerPrice ?? ''),
      stock: String(variant.stock ?? ''),
      moq: String(variant.moq ?? 1)
    };
  });

  return nextState;
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(createEmptyForm);
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
    } catch {
      toast.error('Failed to load data');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(createEmptyForm());
    setImages([]);
    setModal(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      ...createEmptyForm(),
      ...product,
      category: product.category?._id || product.category || '',
      shortDescription: product.shortDescription || product.description || '',
      longDescription: product.longDescription || '',
      storageCondition: product.storageCondition || product.safetyData?.storageConditions || '',
      variants: buildVariantStateFromProduct(product)
    });
    setImages(product.images || []);
    setModal(true);
  };

  const handleImgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data } = await uploadImage(file);
      setImages((prev) => [...prev, data.url]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed');
    }
    setUploading(false);
  };

  const toggleVariant = (size) => {
    setForm((prev) => ({
      ...prev,
      variants: {
        ...prev.variants,
        [size]: {
          ...prev.variants[size],
          enabled: !prev.variants[size].enabled
        }
      }
    }));
  };

  const updateVariantField = (size, key, value) => {
    setForm((prev) => ({
      ...prev,
      variants: {
        ...prev.variants,
        [size]: {
          ...prev.variants[size],
          [key]: value
        }
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    const variants = VARIANT_OPTIONS
      .filter((size) => form.variants[size].enabled)
      .map((size) => ({
        size,
        price: Number(form.variants[size].price || 0),
        offerPrice: Number(form.variants[size].offerPrice || 0),
        stock: Number(form.variants[size].stock || 0),
        moq: Math.max(1, Number(form.variants[size].moq || 1))
      }));

    if (variants.length === 0) {
      toast.error('Please select at least one packaging size');
      return;
    }

    const invalidVariant = variants.find((variant) => variant.price <= 0 || variant.stock < 0);
    if (invalidVariant) {
      toast.error(`Please provide valid price and stock for ${invalidVariant.size}`);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        shortDescription: form.shortDescription,
        longDescription: form.longDescription,
        sku: form.sku,
        brandName: form.brandName,
        color: form.color,
        fragranceType: form.fragranceType,
        productType: form.productType,
        shelfLife: form.shelfLife,
        storageCondition: form.storageCondition,
        ingredients: form.ingredients,
        isFeatured: form.isFeatured,
        isActive: form.isActive,
        images,
        variants
      };

      if (editing) {
        await updateProduct(editing._id, payload);
      } else {
        await createProduct(payload);
      }

      toast.success(editing ? 'Product updated!' : 'Product created!');
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const f = (key) => (e) => setForm((prev) => ({
    ...prev,
    [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
  }));

  const keyword = (currentSearch || search).trim().toLowerCase();
  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(keyword) ||
    (product.sku || '').toLowerCase().includes(keyword) ||
    (product.brandName || '').toLowerCase().includes(keyword)
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-chem-text font-display">Products</h1>
            <p className="text-gray-500 text-sm mt-0.5">{products.length} products in catalogue</p>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <FiPlus /> Add Product
          </button>
        </div>

        <div className="card p-4 mb-6">
          <div className="relative max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, SKU, or brand..."
              className="w-full pl-10 pr-4 py-2.5 bg-chem-bg border border-chem-gray rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-chem-bg border-b border-gray-100">
                <tr>
                  {['Product', 'SKU', 'Category', 'Brand', 'Starting Price', 'Sizes', 'Stock', 'Status', 'Actions'].map((heading) => (
                    <th key={heading} className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(5).fill(0).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={9} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10 text-gray-400">No products found</td>
                  </tr>
                ) : filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-chem-bg transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=60&q=80'}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                        />
                        <div>
                          <div className="font-semibold text-chem-text leading-tight">{product.name}</div>
                          {product.shortDescription && (
                            <div className="text-xs text-gray-400 line-clamp-1">{product.shortDescription}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{product.sku || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{product.category?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{product.brandName || 'Sri Bairavi Chemicals'}</td>
                    <td className="px-4 py-3 font-semibold text-primary-700">₹{getDisplayPrice(product)?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-600">{product.variants?.length || 0} size(s)</td>
                    <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${product.isActive ? 'badge-green' : 'badge-gray'}`}>
                        {product.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 flex items-center justify-center transition-colors"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                        >
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

        {modal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-6 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl animate-slide-up">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-display font-bold text-lg">{editing ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Basic Details</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Product Name *</label>
                      <input required value={form.name} onChange={f('name')} className="input-field" placeholder="Phenyl Compound" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Category *</label>
                      <select required value={form.category} onChange={f('category')} className="input-field">
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Short Description *</label>
                    <textarea
                      required
                      value={form.shortDescription}
                      onChange={f('shortDescription')}
                      rows={2}
                      className="input-field resize-none"
                      placeholder="Short product summary for listings and previews"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Long Description</label>
                    <textarea
                      value={form.longDescription}
                      onChange={f('longDescription')}
                      rows={4}
                      className="input-field resize-none"
                      placeholder="Detailed product description"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">SKU / Product Code</label>
                      <input value={form.sku} onChange={f('sku')} className="input-field" placeholder="SBC-PC-001" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Brand Name</label>
                      <input value={form.brandName} onChange={f('brandName')} className="input-field" placeholder="Sri Bairavi Chemicals" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Product Images *</p>
                  <div className="flex flex-wrap gap-2">
                    {images.map((img, index) => (
                      <div key={index} className="relative w-16 h-16">
                        <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                        <button
                          type="button"
                          onClick={() => setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index))}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
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

                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Packaging Sizes & Pricing</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {VARIANT_OPTIONS.map((size) => (
                      <label key={size} className={`rounded-2xl border px-4 py-3 cursor-pointer transition-all ${form.variants[size].enabled ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white hover:border-primary-300'}`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={form.variants[size].enabled}
                            onChange={() => toggleVariant(size)}
                            className="h-4 w-4 accent-primary-600"
                          />
                          <span className="text-sm font-semibold text-gray-700">{size}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {VARIANT_OPTIONS.filter((size) => form.variants[size].enabled).map((size) => (
                      <div key={size} className="rounded-2xl border border-primary-100 bg-primary-50/60 p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-primary-700">{size}</h3>
                          <button
                            type="button"
                            onClick={() => toggleVariant(size)}
                            className="text-xs font-semibold text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Price *</label>
                            <input
                              type="number"
                              min="0"
                              value={form.variants[size].price}
                              onChange={(e) => updateVariantField(size, 'price', e.target.value)}
                              className="input-field"
                              placeholder="0"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Offer Price</label>
                            <input
                              type="number"
                              min="0"
                              value={form.variants[size].offerPrice}
                              onChange={(e) => updateVariantField(size, 'offerPrice', e.target.value)}
                              className="input-field"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Stock Quantity *</label>
                            <input
                              type="number"
                              min="0"
                              value={form.variants[size].stock}
                              onChange={(e) => updateVariantField(size, 'stock', e.target.value)}
                              className="input-field"
                              placeholder="0"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">MOQ</label>
                            <input
                              type="number"
                              min="1"
                              value={form.variants[size].moq}
                              onChange={(e) => updateVariantField(size, 'moq', e.target.value)}
                              className="input-field"
                              placeholder="1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Product Specifications</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Color</label>
                      <input value={form.color} onChange={f('color')} className="input-field" placeholder="White / Green / Blue" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Fragrance / Perfume Type</label>
                      <input value={form.fragranceType} onChange={f('fragranceType')} className="input-field" placeholder="Lemon / Floral / Lavender" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Product Type</label>
                      <input value={form.productType} onChange={f('productType')} className="input-field" placeholder="Floor Cleaner / Phenyl / Dishwash" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Shelf Life</label>
                      <input value={form.shelfLife} onChange={f('shelfLife')} className="input-field" placeholder="12 months" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Storage Condition</label>
                      <input value={form.storageCondition} onChange={f('storageCondition')} className="input-field" placeholder="Store in a cool and dry place" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Ingredients / Composition</label>
                    <textarea
                      value={form.ingredients}
                      onChange={f('ingredients')}
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Mention active ingredients or composition details"
                    />
                  </div>
                </div>

                <div className="flex gap-6 pt-1">
                  {[['isFeatured', 'Featured Product'], ['isActive', 'Active / Visible']].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form[key]} onChange={f(key)} className="w-4 h-4 accent-primary-600" />
                      <span className="text-sm text-gray-600">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="btn-outline flex-1">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1">
                    {saving ? 'Saving…' : editing ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
