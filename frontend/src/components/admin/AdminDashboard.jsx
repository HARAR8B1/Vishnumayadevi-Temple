import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  adminGetGallery,
  adminGetEvents,
  adminGetContacts,
} from "../../api/templeApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    gallery: 0,
    events: 0,
    contacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [gallery, events, contacts] = await Promise.all([
          adminGetGallery(),
          adminGetEvents(),
          adminGetContacts(),
        ]);
        setStats({
          gallery: gallery.length,
          events: events.length,
          contacts: contacts.length,
        });
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  const statCards = [
    { title: "Gallery Images", count: stats.gallery, icon: "🖼️", link: "/admin/dashboard/gallery", color: "bg-blue-50 text-blue-600 border-blue-200" },
    { title: "Upcoming Events", count: stats.events, icon: "📅", link: "/admin/dashboard/events", color: "bg-green-50 text-green-600 border-green-200" },
    { title: "Contact Submissions", count: stats.contacts, icon: "✉️", link: "/admin/dashboard/contacts", color: "bg-purple-50 text-purple-600 border-purple-200" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-charcoal mb-2">Welcome Back, Admin! 👋</h2>
        <p className="text-charcoal/60">Here is an overview of the temple website content.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className={`flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white ${card.color.replace(/bg-\w+-50|text-\w+-600/g, '')}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${card.color.split(' ').slice(0, 2).join(' ')}`}>
                {card.icon}
              </div>
              <span className="text-charcoal/40 text-sm">Manage →</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-charcoal mb-1">{card.count}</h3>
              <p className="text-charcoal/60 text-sm font-medium">{card.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-charcoal mb-4 border-b border-gray-100 pb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/dashboard/gallery" className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-charcoal text-sm font-medium rounded-xl transition-colors border border-gray-200 text-center">
            + Add Image
          </Link>
          <Link to="/admin/dashboard/events" className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-charcoal text-sm font-medium rounded-xl transition-colors border border-gray-200 text-center">
            + Create Event
          </Link>
          <Link to="/admin/dashboard/temple-info" className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-charcoal text-sm font-medium rounded-xl transition-colors border border-gray-200 text-center">
            Edit Info
          </Link>
          <Link to="/admin/dashboard/donation" className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-charcoal text-sm font-medium rounded-xl transition-colors border border-gray-200 text-center">
            Update QR
          </Link>
        </div>
      </div>
    </div>
  );
}
