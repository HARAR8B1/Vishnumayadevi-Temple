import { useState, useEffect } from "react";
import { adminGetDonation, adminUpdateDonation } from "../../api/templeApi";

export default function AdminDonation() {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
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

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-charcoal/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-t-4 border-red-500 animate-fade-in-up">
            <div className="flex items-start gap-4 mb-2">
              <div className="text-4xl">⚠️</div>
              <div>
                <h3 className="text-xl font-bold text-red-600 mb-1">Warning</h3>
                <p className="text-charcoal font-bold text-base">Account details change not recommended</p>
                <p className="text-red-500 font-medium text-sm mt-1">Changes will be logged.</p>
                <p className="text-charcoal/60 text-sm mt-3">Are you sure you want to proceed with updating the donation configuration?</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-charcoal bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors text-sm"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
