import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 relative overflow-hidden">
      {/* Decorative blurred background circle */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary opacity-20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-dark opacity-20 rounded-full blur-2xl z-0" />
      <div className="relative z-10 max-w-md w-full mx-auto">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl rounded-2xl px-8 py-10 space-y-8">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Shield size={32} className="text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-white drop-shadow">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Please enter your credentials to access the monitoring system
            </p>
          </div>

          <form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            {error && (
              <div className="bg-danger/20 border border-danger/60 rounded-md p-3 text-sm text-danger shadow">
                {error}
              </div>
            )}

            <div className="space-y-4 rounded-md">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-700 bg-slate-800/80 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 text-base transition-all shadow-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-700 bg-slate-800/80 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 text-base transition-all shadow-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-base font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>

            <div className="text-center text-xs text-slate-400 mt-6">
              <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-4 inline-block shadow">
                <p className="font-semibold text-slate-300 mb-2">
                  Demo accounts:
                </p>
                <div className="space-y-1">
                  <p>
                    <span className="font-mono text-primary">
                      admin@example.com
                    </span>{" "}
                    /{" "}
                    <span className="font-mono text-primary-dark">
                      admin123
                    </span>
                  </p>
                  <p>
                    <span className="font-mono text-primary">
                      manager@example.com
                    </span>{" "}
                    /{" "}
                    <span className="font-mono text-primary-dark">
                      manager123
                    </span>
                  </p>
                  <p>
                    <span className="font-mono text-primary">
                      staff@example.com
                    </span>{" "}
                    /{" "}
                    <span className="font-mono text-primary-dark">
                      staff123
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
