import { useState, useEffect } from "react";
import { 
  adminGetCommittee, 
  adminAddCommitteeMember, 
  adminUpdateCommitteeMember, 
  adminDeleteCommitteeMember,
  adminReorderCommittee 
} from "../../api/templeApi";

export default function AdminCommittee() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    post: "",
    mobile_number: "",
    address: "",
    id_proof_number: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await adminGetCommittee();
      setMembers(data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch committee members.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || "",
        post: member.post || "",
        mobile_number: member.mobile_number || "",
        address: member.address || "",
        id_proof_number: member.id_proof_number || ""
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: "",
        post: "",
        mobile_number: "",
        address: "",
        id_proof_number: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingMember) {
        await adminUpdateCommitteeMember(editingMember.id, formData);
      } else {
        await adminAddCommitteeMember(formData);
      }
      fetchMembers();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("Failed to save member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await adminDeleteCommitteeMember(id);
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete member.");
    }
  };

  const moveUp = async (index) => {
    if (index === 0) return;
    const newMembers = [...members];
    [newMembers[index - 1], newMembers[index]] = [newMembers[index], newMembers[index - 1]];
    saveOrder(newMembers);
  };

  const moveDown = async (index) => {
    if (index === members.length - 1) return;
    const newMembers = [...members];
    [newMembers[index], newMembers[index + 1]] = [newMembers[index + 1], newMembers[index]];
    saveOrder(newMembers);
  };

  const saveOrder = async (reorderedMembers) => {
    // Optimistic UI update
    setMembers(reorderedMembers);
    
    // Prepare payload
    const items = reorderedMembers.map((m, idx) => ({ id: m.id, sort_order: idx + 1 }));
    try {
      await adminReorderCommittee(items);
    } catch (err) {
      console.error("Failed to reorder:", err);
      alert("Failed to save new order.");
      fetchMembers(); // Revert on failure
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Temple Committee</h2>
          <p className="text-charcoal/60">Manage committee members, their posts, and details.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2.5 bg-saffron hover:bg-saffron-dark text-white font-medium rounded-xl transition-colors shadow-sm whitespace-nowrap"
        >
          + Add Member
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-charcoal/50">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-charcoal/50">
            No committee members found. Add your first member!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-charcoal font-semibold">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Post</th>
                  <th className="py-4 px-6">Mobile Number</th>
                  <th className="py-4 px-6">Address</th>
                  <th className="py-4 px-6">ID Proof</th>
                  <th className="py-4 px-6 text-center">Order</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {members.map((member, idx) => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-charcoal">{member.name}</td>
                    <td className="py-4 px-6 text-charcoal/70">{member.post}</td>
                    <td className="py-4 px-6 text-charcoal/70">{member.mobile_number || "-"}</td>
                    <td className="py-4 px-6 text-charcoal/70 max-w-xs truncate" title={member.address}>
                      {member.address || "-"}
                    </td>
                    <td className="py-4 px-6 text-charcoal/70">{member.id_proof_number || "-"}</td>
                    
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => moveUp(idx)}
                          disabled={idx === 0}
                          className="p-1.5 text-gray-400 hover:text-saffron hover:bg-saffron/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveDown(idx)}
                          disabled={idx === members.length - 1}
                          className="p-1.5 text-gray-400 hover:text-saffron hover:bg-saffron/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenModal(member)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors mr-2 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-charcoal">
                {editingMember ? "Edit Member" : "Add New Member"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="member-form" onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors bg-gray-50"
                      placeholder="e.g. T.M. Karthikeyan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Post / Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.post}
                      onChange={(e) => setFormData({ ...formData, post: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors bg-gray-50"
                      placeholder="e.g. President"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors bg-gray-50"
                      placeholder="e.g. 98410 87327, 81245 74760"
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-1">ID Proof Number</label>
                    <input
                      type="text"
                      value={formData.id_proof_number}
                      onChange={(e) => setFormData({ ...formData, id_proof_number: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors bg-gray-50"
                      placeholder="e.g. Aadhar / PAN number (Stored securely)"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-1">Residential Address</label>
                    <textarea
                      rows="3"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors bg-gray-50 resize-none"
                      placeholder="Enter full address"
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-charcoal font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="member-form"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-saffron hover:bg-saffron-dark text-white font-medium rounded-xl transition-colors disabled:opacity-50 min-w-[120px]"
              >
                {isSubmitting ? "Saving..." : "Save Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
