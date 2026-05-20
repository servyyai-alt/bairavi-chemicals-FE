import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { getStoreSettings, updateStoreSettings } from '../../services/api';

const defaultForm = {
  gstPercentage: '18',
  shippingCharge: '49',
  freeShippingAbove: '499',
  codAvailable: true
};

export default function AdminSettings() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getStoreSettings();
        const settings = data.settings || {};
        setForm({
          gstPercentage: String(settings.gstPercentage ?? 18),
          shippingCharge: String(settings.shippingCharge ?? 49),
          freeShippingAbove: String(settings.freeShippingAbove ?? 499),
          codAvailable: Boolean(settings.codAvailable)
        });
      } catch {
        toast.error('Failed to load store settings');
      }
      setLoading(false);
    })();
  }, []);

  const updateField = (key) => (event) => {
    setForm((current) => ({
      ...current,
      [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateStoreSettings({
        gstPercentage: Number(form.gstPercentage || 0),
        shippingCharge: Number(form.shippingCharge || 0),
        freeShippingAbove: Number(form.freeShippingAbove || 0),
        codAvailable: form.codAvailable
      });
      toast.success('Store settings updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-chem-text font-display">Store Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Control GST, shipping, free shipping threshold, and COD availability.</p>
        </div>

        <div className="card max-w-3xl p-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">GST Percentage *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.gstPercentage}
                    onChange={updateField('gstPercentage')}
                    className="input-field"
                    placeholder="18"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shipping Charge *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.shippingCharge}
                    onChange={updateField('shippingCharge')}
                    className="input-field"
                    placeholder="49"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Free Shipping Above Amount *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.freeShippingAbove}
                    onChange={updateField('freeShippingAbove')}
                    className="input-field"
                    placeholder="499"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-gray-200 px-4 py-3 w-full">
                    <input
                      type="checkbox"
                      checked={form.codAvailable}
                      onChange={updateField('codAvailable')}
                      className="w-4 h-4 accent-primary-600"
                    />
                    <span className="text-sm font-semibold text-gray-700">COD Available</span>
                  </label>
                </div>
              </div>

              <div className="rounded-2xl bg-primary-50 border border-primary-100 px-4 py-4 text-sm text-gray-700">
                <p><strong>Preview:</strong> GST {form.gstPercentage || 0}% · Shipping ₹{form.shippingCharge || 0} · Free above ₹{form.freeShippingAbove || 0} · COD {form.codAvailable ? 'Enabled' : 'Disabled'}</p>
              </div>

              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
