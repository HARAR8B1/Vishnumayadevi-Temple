import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetDonations,
  adminAddDonationRecord,
  adminUpdateDonationRecord,
  adminDeleteDonationRecord
} from "../../api/templeApi";

export default function AdminAccounts() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Modal state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const emptyForm = {
    receipt_no: "",
    donor_name: "",
    address: "",
    received_from: "",
    towards: "",
    amount: "",
    amount_words: "",
    date: new Date().toISOString().split("T")[0],
    notes: ""
  };
  
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const { data, total: dbTotal } = await adminGetDonations();
      setDonations(data || []);
      setTotal(dbTotal || 0);
    } catch (err) {
      console.error("Failed to fetch donations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (donation) => {
    setFormData({
      ...donation,
      date: donation.date ? new Date(donation.date).toISOString().split("T")[0] : "",
    });
    setEditingId(donation.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.donor_name) {
      alert("Donor Name is required");
      return;
    }
    try {
      if (editingId) {
        await adminUpdateDonationRecord(editingId, formData);
      } else {
        await adminAddDonationRecord(formData);
      }
      setIsModalOpen(false);
      fetchDonations();
    } catch (err) {
      console.error("Failed to save record", err);
      alert("Failed to save record.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record? This affects the total balance.")) return;
    try {
      await adminDeleteDonationRecord(id);
      fetchDonations();
    } catch (err) {
      console.error("Failed to delete record", err);
    }
  };

  const handleGenerateReceipt = (item) => {
    navigate("/admin/dashboard/receipts", { state: { donation: item } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Header & Total Balance ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Accounts / Donations</h2>
          <p className="text-charcoal/60">Manage temple donation records and receipts.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-saffron/10 border border-saffron/30 px-6 py-3 rounded-2xl text-right">
            <p className="text-xs font-bold text-saffron uppercase tracking-widest mb-1">Total Balance</p>
            <p className="text-2xl font-bold text-charcoal">₹ {Number(total).toLocaleString('en-IN')}</p>
          </div>
          
          <button
            onClick={handleOpenAdd}
            className="bg-charcoal text-cream px-5 py-3.5 rounded-2xl font-bold text-sm hover:bg-charcoal-light transition-colors shadow-sm flex items-center gap-2 h-full"
          >
            <span>+</span> Add Record
          </button>
        </div>
      </div>

      {/* ── Donations Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-bold text-charcoal uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-bold text-charcoal uppercase tracking-wider">Receipt No.</th>
                <th className="py-4 px-6 text-xs font-bold text-charcoal uppercase tracking-wider">Donor Name</th>
                <th className="py-4 px-6 text-xs font-bold text-charcoal uppercase tracking-wider">Towards</th>
                <th className="py-4 px-6 text-xs font-bold text-charcoal uppercase tracking-wider text-right">Amount (₹)</th>
                <th className="py-4 px-6 text-xs font-bold text-charcoal uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-charcoal/40">
                    No records found.
                  </td>
                </tr>
              ) : (
                donations.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-charcoal whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-4 px-6 text-sm text-charcoal/60 font-mono">
                      {item.receipt_no || "-"}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-charcoal">{item.donor_name}</p>
                      {item.notes === "Auto-saved from Receipt Generator" && (
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">Auto-Receipt</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-charcoal/70">
                      {item.towards || "-"}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-green-700 text-right">
                      {Number(item.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleGenerateReceipt(item)}
                          className="p-2 text-saffron-dark hover:bg-saffron/10 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold border border-saffron/30"
                          title="Generate Receipt"
                        >
                          📄 Receipt
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-charcoal mb-6 border-b pb-4">
              {editingId ? "Edit Record" : "Add New Record"}
            </h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-charcoal mb-1">Date</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-charcoal mb-1">Receipt No.</label>
                <input type="text" value={formData.receipt_no} onChange={e => setFormData({...formData, receipt_no: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-charcoal mb-1">Donor Name *</label>
                <input type="text" value={formData.donor_name} onChange={e => setFormData({...formData, donor_name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-charcoal mb-1">Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-charcoal mb-1">Towards (Purpose)</label>
                <input type="text" value={formData.towards} onChange={e => setFormData({...formData, towards: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron" />
              </div>
              <div>
                <label className="block text-sm font-bold text-charcoal mb-1">Amount (₹)</label>
                <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron" />
              </div>
              <div>
                <label className="block text-sm font-bold text-charcoal mb-1">Amount in Words</label>
                <input type="text" value={formData.amount_words} onChange={e => setFormData({...formData, amount_words: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron" />
              </div>
              
              <div className="md:col-span-2 pt-6 mt-2 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-charcoal hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="bg-saffron text-charcoal px-8 py-2.5 rounded-xl font-bold hover:bg-saffron-dark transition-colors">
                  {editingId ? "Save Changes" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
