import { useState, useEffect } from "react";
import {
  adminGetEvents,
  adminAddEvent,
  adminDeleteEvent,
} from "../../api/templeApi";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [newEvent, setNewEvent] = useState({
    titleEN: "",
    titleTA: "",
    dateEN: "",
    dateTA: "",
    descEN: "",
    descTA: "",
    type: "festival",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAutoTranslate = async (text, targetField) => {
    if (!text) return;
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      const data = await res.json();
      const translatedText = data[0].map(item => item[0]).join('');
      setNewEvent(prev => ({ ...prev, [targetField]: translatedText }));
    } catch (error) {
      console.error("Auto-translate failed:", error);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await adminGetEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAddEvent({
        title: { en: newEvent.titleEN, ta: newEvent.titleTA },
        date: { en: newEvent.dateEN, ta: newEvent.dateTA },
        description: { en: newEvent.descEN, ta: newEvent.descTA },
        type: newEvent.type,
      }, imageFile);
      setIsAdding(false);
      setImageFile(null);
      setPreviewUrl("");
      setNewEvent({ titleEN: "", titleTA: "", dateEN: "", dateTA: "", descEN: "", descTA: "", type: "festival" });
      fetchEvents();
    } catch (error) {
      console.error("Failed to add event", error);
      alert("Failed to save event details.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await adminDeleteEvent(id);
      fetchEvents();
    } catch (error) {
      console.error("Failed to delete event", error);
    }
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-charcoal">Manage Events</h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setImageFile(null);
            setPreviewUrl("");
          }}
          className="bg-saffron text-charcoal px-4 py-2 rounded-xl font-bold text-sm hover:bg-saffron-dark transition-colors"
        >
          {isAdding ? "Cancel" : "+ Create Event"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <h3 className="font-bold text-lg mb-4 text-charcoal">Create New Event</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Event Type</label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                className="w-full md:w-64 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron bg-white"
              >
                <option value="festival">Festival</option>
                <option value="weekly">Weekly Pooja</option>
                <option value="monthly">Monthly Pooja</option>
                <option value="special">Special Occasion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Event Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImageFile(file);
                  if (file) setPreviewUrl(URL.createObjectURL(file));
                }}
                className="w-full text-sm text-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-saffron file:text-charcoal hover:file:bg-saffron-dark"
              />
              {previewUrl && (
                <div className="mt-2 relative inline-block">
                  <img src={previewUrl} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
                  <button type="button" onClick={() => { setImageFile(null); setPreviewUrl(""); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">x</button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* English Fields */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-sm text-charcoal/70 uppercase tracking-wider">English Details</h4>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Title</label>
                  <input required type="text" value={newEvent.titleEN} onChange={(e) => setNewEvent({ ...newEvent, titleEN: e.target.value })} onBlur={(e) => handleAutoTranslate(e.target.value, 'titleTA')} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Date String (e.g., "25 July 2026" or "Every Friday")</label>
                  <input required type="text" value={newEvent.dateEN} onChange={(e) => setNewEvent({ ...newEvent, dateEN: e.target.value })} onBlur={(e) => handleAutoTranslate(e.target.value, 'dateTA')} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
                  <textarea required rows={2} value={newEvent.descEN} onChange={(e) => setNewEvent({ ...newEvent, descEN: e.target.value })} onBlur={(e) => handleAutoTranslate(e.target.value, 'descTA')} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron" />
                </div>
              </div>

              {/* Tamil Fields */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-sm text-charcoal/70 uppercase tracking-wider">தமிழ் (Tamil Details)</h4>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">தலைப்பு (Title)</label>
                  <input required type="text" value={newEvent.titleTA} onChange={(e) => setNewEvent({ ...newEvent, titleTA: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">தேதி (Date)</label>
                  <input required type="text" value={newEvent.dateTA} onChange={(e) => setNewEvent({ ...newEvent, dateTA: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">விளக்கம் (Description)</label>
                  <textarea required rows={2} value={newEvent.descTA} onChange={(e) => setNewEvent({ ...newEvent, descTA: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button type="submit" className="bg-charcoal text-cream px-6 py-2 rounded-xl font-bold text-sm hover:bg-charcoal-light transition-colors">
                Save Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-charcoal/70 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium border-b border-gray-200">Event Info</th>
                <th className="p-4 font-medium border-b border-gray-200">Date</th>
                <th className="p-4 font-medium border-b border-gray-200">Type</th>
                <th className="p-4 font-medium border-b border-gray-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    {evt.imageUrl ? (
                      <img src={evt.imageUrl} alt="Event" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl">📅</div>
                    )}
                    <div>
                      <div className="font-bold text-charcoal text-sm">{evt.title?.en}</div>
                      <div className="text-charcoal/60 text-xs mt-0.5">{evt.title?.ta}</div>
                      <div className="text-charcoal/50 text-[11px] line-clamp-1 mt-1">{evt.description?.en}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-charcoal text-sm">{evt.date?.en}</div>
                    <div className="text-charcoal/60 text-xs mt-0.5">{evt.date?.ta}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-1 bg-saffron/10 text-saffron-dark text-[10px] font-bold rounded-lg uppercase">
                      {evt.type}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(evt.id)}
                      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400 text-sm">No events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
