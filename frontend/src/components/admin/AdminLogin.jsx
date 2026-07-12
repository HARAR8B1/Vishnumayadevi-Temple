import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/templeApi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Forgot Password States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: username, 2: answer & new pass
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(username, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchQuestion = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { adminGetSecurityQuestion } = await import("../../api/templeApi");
      const res = await adminGetSecurityQuestion(username);
      setSecurityQuestion(res.question);
      setResetStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch security question.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { adminResetPassword } = await import("../../api/templeApi");
      await adminResetPassword(username, securityAnswer, newPassword);
      setSuccessMsg("Password reset successfully. Please log in.");
      setIsForgotPassword(false);
      setResetStep(1);
      setPassword("");
      setNewPassword("");
      setSecurityAnswer("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-saffron/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-maroon/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-temple-gold/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-saffron/10 border border-saffron/20 mb-4 animate-pulse-glow">
            <span className="text-3xl">🙏</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-cream mb-2">
            Admin <span className="text-gradient-gold">Portal</span>
          </h1>
          <p className="text-cream/50 text-sm">
            Sri Vishnu Maya Devi Amman Temple
          </p>
        </div>

        {/* Login / Reset Card */}
        <div className="glass-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-saffron/10">
          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-5 p-3 bg-green-500/10 border border-green-500/20 text-green-300 rounded-xl text-sm flex items-center gap-2">
              <span>✅</span> {successMsg}
            </div>
          )}

          {!isForgotPassword ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="admin-username" className="block text-xs sm:text-sm font-medium text-cream/70 mb-1.5">
                  Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-saffron/20 bg-charcoal-light text-cream placeholder-cream/30 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-xs sm:text-sm font-medium text-cream/70 mb-1.5">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-saffron/20 bg-charcoal-light text-cream placeholder-cream/30 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
                />
                <div className="text-right mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError("");
                      setSuccessMsg("");
                      setResetStep(1);
                    }}
                    className="text-xs text-saffron hover:text-temple-gold transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-saffron to-temple-gold hover:from-saffron-dark hover:to-saffron text-charcoal font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-saffron/20 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-cream border-b border-saffron/20 pb-2 mb-4">Reset Password</h2>
              
              {resetStep === 1 ? (
                <form onSubmit={handleFetchQuestion} className="space-y-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-cream/70 mb-1.5">
                      Enter Username to find your account
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-saffron/20 bg-charcoal-light text-cream placeholder-cream/30 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !username}
                    className="w-full py-3 bg-saffron hover:bg-saffron-dark text-charcoal font-bold rounded-xl transition-all disabled:opacity-50 text-sm"
                  >
                    {loading ? "Searching..." : "Next"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-saffron mb-1.5">
                      Security Question:
                    </label>
                    <div className="px-4 py-3 bg-charcoal-light rounded-xl border border-saffron/20 text-cream text-sm">
                      {securityQuestion}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-cream/70 mb-1.5">
                      Your Answer
                    </label>
                    <input
                      type="text"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-saffron/20 bg-charcoal-light text-cream focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-cream/70 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-saffron/20 bg-charcoal-light text-cream focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-saffron hover:bg-saffron-dark text-charcoal font-bold rounded-xl transition-all disabled:opacity-50 text-sm"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError("");
                  }}
                  className="text-xs text-cream/50 hover:text-cream transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back to Site Link */}
        <div className="text-center mt-6">
          <a href="/" className="text-cream/40 hover:text-saffron text-xs transition-colors">
            ← Back to Temple Website
          </a>
        </div>
      </div>
    </div>
  );
}
