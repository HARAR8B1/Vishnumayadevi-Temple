import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { adminVerify, adminLogout } from "../../api/templeApi";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await adminVerify();
        setIsVerified(true);
      } catch (err) {
        adminLogout();
        navigate("/admin");
      }
    };
    checkAuth();
  }, [navigate]);

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saffron"></div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Gallery", path: "/admin/dashboard/gallery", icon: "🖼️" },
    { name: "Events", path: "/admin/dashboard/events", icon: "📅" },
    { name: "Temple Info", path: "/admin/dashboard/temple-info", icon: "🕉️" },
    { name: "Donation Config", path: "/admin/dashboard/donation", icon: "💰" },
    { name: "Contact Forms", path: "/admin/dashboard/contacts", icon: "✉️" },
  ];

  const handleLogout = () => {
    adminLogout();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-charcoal text-saffron p-4 flex justify-between items-center z-20">
        <div className="font-heading font-bold text-lg flex items-center gap-2">
          <span>🙏</span> Temple Admin
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-saffron focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`bg-charcoal text-cream w-full md:w-64 flex-shrink-0 flex flex-col absolute md:relative z-10 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } min-h-screen md:min-h-0`}
      >
        <div className="p-6 hidden md:block">
          <div className="font-heading text-xl font-bold text-saffron flex items-center gap-2 mb-1">
            <span>🙏</span> Admin Portal
          </div>
          <div className="text-[10px] text-cream/50 uppercase tracking-widest">
            Vishnu Maya Devi Temple
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 md:py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-saffron/10 text-saffron font-medium border border-saffron/20"
                    : "text-cream/70 hover:bg-white/5 hover:text-cream"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors text-sm font-medium"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-cream">
        {/* Top bar for desktop */}
        <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center px-8 justify-between shadow-sm shrink-0">
          <h1 className="text-lg font-bold text-charcoal">
            {navItems.find((item) => item.path === location.pathname)?.name || "Admin"}
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-charcoal text-saffron flex items-center justify-center font-bold text-sm">
              A
            </div>
            <span className="text-sm font-medium text-charcoal">Admin User</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-charcoal/50 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
