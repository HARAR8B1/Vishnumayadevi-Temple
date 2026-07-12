import { useCallback, useEffect, useState } from "react";
import { adminGetAuditLogs } from "../../api/templeApi";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminGetAuditLogs({
        limit,
        offset: (page - 1) * limit
      });
      setLogs(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      setError("Failed to fetch activity logs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-charcoal mb-2">Activity Logs</h2>
        <p className="text-charcoal/60">Track logins, changes, and updates made in the admin portal.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-red-500">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-charcoal uppercase tracking-wider">Date & Time</th>
                  <th className="py-4 px-6 text-xs font-bold text-charcoal uppercase tracking-wider">User</th>
                  <th className="py-4 px-6 text-xs font-bold text-charcoal uppercase tracking-wider">Action</th>
                  <th className="py-4 px-6 text-xs font-bold text-charcoal uppercase tracking-wider">Description</th>
                  <th className="py-4 px-6 text-xs font-bold text-charcoal uppercase tracking-wider hidden sm:table-cell">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-charcoal/40">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-saffron mx-auto mb-4"></div>
                      Loading logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-charcoal/40">
                      No activity logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm text-charcoal whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-charcoal">
                        {log.username}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          log.action.includes('CRITICAL')
                            ? 'bg-red-600 text-white animate-pulse'
                            : log.action.includes('LOGIN') 
                            ? log.action === 'LOGIN_FAILED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            : log.action.includes('PASSWORD')
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-sm ${log.action.includes('CRITICAL') ? 'text-red-600 font-bold' : 'text-charcoal/70'}`}>
                        {log.description || "-"}
                      </td>
                      <td className="py-4 px-6 text-sm text-charcoal/50 font-mono hidden sm:table-cell">
                        {log.ip_address || "Unknown"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-charcoal/60">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
