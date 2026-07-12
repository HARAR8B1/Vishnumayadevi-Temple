import { useState, useEffect } from "react";
import { adminGetTempleInfo, adminUpdateTempleInfo } from "../../api/templeApi";

export default function AdminTempleInfo() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const data = await adminGetTempleInfo();
      setInfo(data);
    } catch (error) {
      console.error("Failed to fetch temple info", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateTempleInfo(info);
      alert("Temple info updated successfully!");
    } catch (error) {
      console.error("Failed to update temple info", error);
      alert("Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !info) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-charcoal">Temple Information</h2>
        <p className="text-charcoal/60 text-sm mt-1">Update general details and timings.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Contact Details */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-charcoal border-b border-gray-100 pb-2">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Phone Number(s)</label>
              <input
                type="text"
                value={info.phone}
                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
              <input
                type="text"
                value={info.email}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1">Address (English)</label>
              <textarea
                rows={2}
                value={info.address?.en || ""}
                onChange={(e) => setInfo({ ...info, address: { ...info.address, en: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1">Address (Tamil)</label>
              <textarea
                rows={2}
                value={info.address?.ta || ""}
                onChange={(e) => setInfo({ ...info, address: { ...info.address, ta: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-charcoal border-b border-gray-100 pb-2">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">YouTube URL</label>
              <input
                type="url"
                value={info.youtube || ""}
                onChange={(e) => setInfo({ ...info, youtube: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Facebook URL</label>
              <input
                type="url"
                value={info.facebook || ""}
                onChange={(e) => setInfo({ ...info, facebook: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Instagram URL</label>
              <input
                type="url"
                value={info.instagram || ""}
                onChange={(e) => setInfo({ ...info, instagram: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-charcoal text-cream px-8 py-3 rounded-xl font-bold text-sm hover:bg-charcoal-light transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
