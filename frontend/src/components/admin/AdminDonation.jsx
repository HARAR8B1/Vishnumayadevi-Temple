import { useState, useEffect } from "react";
import { adminGetDonation, adminUpdateDonation } from "../../api/templeApi";

export default function AdminDonation() {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDonation();
  }, []);

  const fetchDonation = async () => {
    try {
      const data = await adminGetDonation();
      setDonation(data);
    } catch (error) {
      console.error("Failed to fetch donation info", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateDonation(donation);
      alert("Donation config updated successfully!");
    } catch (error) {
      console.error("Failed to update donation", error);
      alert("Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  const handleBankChange = (field, value) => {
    setDonation({
      ...donation,
      bankDetails: {
        ...donation.bankDetails,
        [field]: value
      }
    });
  };

  if (loading || !donation) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-charcoal">Donation Settings</h2>
        <p className="text-charcoal/60 text-sm mt-1">Manage bank details, UPI, and QR code for the donation section.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Bank Details */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-charcoal border-b border-gray-100 pb-2">Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Account Name</label>
              <input
                type="text"
                value={donation.bankDetails?.accountName || ""}
                onChange={(e) => handleBankChange("accountName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Bank Name</label>
              <input
                type="text"
                value={donation.bankDetails?.bankName || ""}
                onChange={(e) => handleBankChange("bankName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Account Number</label>
              <input
                type="text"
                value={donation.bankDetails?.accountNo || ""}
                onChange={(e) => handleBankChange("accountNo", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">IFSC Code</label>
              <input
                type="text"
                value={donation.bankDetails?.ifscCode || ""}
                onChange={(e) => handleBankChange("ifscCode", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">UPI ID</label>
              <input
                type="text"
                value={donation.bankDetails?.upiId || ""}
                onChange={(e) => handleBankChange("upiId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">QR Code Image URL</label>
              <input
                type="text"
                value={donation.qrImage || ""}
                onChange={(e) => setDonation({ ...donation, qrImage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron"
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
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
