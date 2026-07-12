import { useState } from "react";
import { adminChangePassword } from "../../api/templeApi";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityMessage, setSecurityMessage] = useState({ text: "", type: "" });

  const SECURITY_QUESTIONS = [
    "What is your favorite pet name?",
    "What's your first car name?",
    "What is the name of the city you born?",
    "Whats your first school name?",
    "Whats your first college name?"
  ];

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords do not match.", type: "error" });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ text: "New password must be at least 6 characters.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await adminChangePassword(currentPassword, newPassword);
      setMessage({ text: "Password updated successfully.", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to update password.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityQuestionSubmit = async (e) => {
    e.preventDefault();
    setSecurityMessage({ text: "", type: "" });

    if (!securityQuestion) {
      setSecurityMessage({ text: "Please select a security question.", type: "error" });
      return;
    }

    if (!securityAnswer.trim()) {
      setSecurityMessage({ text: "Please provide an answer.", type: "error" });
      return;
    }

    setSecurityLoading(true);
    try {
      // Import this dynamically or at the top
      const { adminSetSecurityQuestion } = await import("../../api/templeApi");
      await adminSetSecurityQuestion(securityQuestion, securityAnswer);
      setSecurityMessage({ text: "Security question updated successfully.", type: "success" });
      setSecurityAnswer("");
    } catch (err) {
      setSecurityMessage({
        text: err.response?.data?.message || "Failed to update security question.",
        type: "error",
      });
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-charcoal mb-2">Account Settings</h2>
        <p className="text-charcoal/60">Update your admin account credentials.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-charcoal mb-4 border-b border-gray-100 pb-4">
          Reset Password
        </h3>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <span>{message.type === "success" ? "✅" : "⚠️"}</span> {message.text}
          </div>
        )}

        <form onSubmit={handlePasswordReset} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-charcoal focus:bg-white focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-charcoal focus:bg-white focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all"
            />
            <p className="text-xs text-charcoal/40 mt-1">Must be at least 6 characters.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-charcoal focus:bg-white focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-saffron hover:bg-saffron-dark text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              Update Password
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mt-8">
        <h3 className="text-lg font-bold text-charcoal mb-4 border-b border-gray-100 pb-4">
          Security Question
        </h3>
        <p className="text-sm text-charcoal/60 mb-6">
          Set up a security question to recover your account if you forget your password.
        </p>

        {securityMessage.text && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 ${
              securityMessage.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <span>{securityMessage.type === "success" ? "✅" : "⚠️"}</span> {securityMessage.text}
          </div>
        )}

        <form onSubmit={handleSecurityQuestionSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
              Select Question
            </label>
            <select
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-charcoal focus:bg-white focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all"
            >
              <option value="" disabled>-- Select a question --</option>
              {SECURITY_QUESTIONS.map((q, idx) => (
                <option key={idx} value={q}>{q}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
              Your Answer
            </label>
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
              placeholder="Enter your answer"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-charcoal focus:bg-white focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={securityLoading}
              className="px-6 py-2.5 bg-charcoal hover:bg-charcoal-light text-cream font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {securityLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              Save Security Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
