import { useState, useEffect } from "react";
import { adminGetContacts, adminDeleteContact } from "../../api/templeApi";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await adminGetContacts();
      // Sort by newest first
      setContacts(data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await adminDeleteContact(id);
      fetchContacts();
    } catch (error) {
      console.error("Failed to delete contact", error);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-charcoal">Contact Submissions</h2>
        <p className="text-charcoal/60 text-sm mt-1">View inquiries submitted by devotees.</p>
      </div>

      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-charcoal/50">
            No inquiries have been received yet.
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative group">
              <button
                onClick={() => handleDelete(contact.id)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-saffron/10 text-saffron font-bold flex items-center justify-center text-lg">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-charcoal">{contact.name}</h4>
                  <p className="text-xs text-charcoal/50">{formatDate(contact.submittedAt)}</p>
                </div>
              </div>

              <div className="mb-4 pl-14">
                <p className="text-charcoal/80 text-sm whitespace-pre-wrap">{contact.message}</p>
              </div>

              <div className="pl-14 flex flex-wrap gap-3">
                <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-charcoal/70 hover:bg-gray-100 transition-colors">
                  <span>✉️</span> {contact.email}
                </a>
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-charcoal/70 hover:bg-gray-100 transition-colors">
                    <span>📞</span> {contact.phone}
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
