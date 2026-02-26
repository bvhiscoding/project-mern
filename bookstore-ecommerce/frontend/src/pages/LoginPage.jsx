import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearError, login } from "../redux/slices/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth || {});
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    if (!formData.email || !formData.password) {
      setFormError("Please enter both email and password.");
      return;
    }

    dispatch(clearError());
    dispatch(login(formData))
      .unwrap()
      .catch((err) => {
        setFormError(err || "Sign in failed");
      });
  };

  return (
    <div className="min-h-screen bg-sand text-ink">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
        <div className="relative hidden overflow-hidden bg-ink text-sand lg:block">
          <div className="absolute inset-0 bg-grain opacity-40 [background-size:14px_14px]" />
          <div className="relative z-10 flex h-full flex-col justify-center p-14">
            <p className="text-xs uppercase tracking-[0.4em] text-sand/60">
              Ink & Oak
            </p>
            <h1 className="mt-4 text-4xl font-display text-sand drop-shadow-sm">
              Welcome back to your reading ritual.
            </h1>
            <p className="mt-4 text-sm text-sand/70">
              Sign in to manage orders, save your wishlist, and access curated
              drops.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-3xl border border-ink/10 bg-white p-8 shadow-card">
            <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
              Member login
            </p>
            <h2 className="mt-3 text-2xl font-display text-ink">Sign in</h2>
            <p className="mt-2 text-sm text-ink/60">
              Use your email to unlock your shelf.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-ink/70">
                Email address
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink shadow-sm focus:border-pine focus:ring-2 focus:ring-pine/20 focus:outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-ink/70">
                Password
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink shadow-sm focus:border-pine focus:ring-2 focus:ring-pine/20 focus:outline-none"
                />
              </label>

              {formError ? (
                <div className="rounded-2xl border border-ember/20 bg-ember/10 px-4 py-3 text-sm text-ink">
                  {formError}
                </div>
              ) : null}
              {error ? (
                <div className="rounded-2xl border border-ember/20 bg-ember/10 px-4 py-3 text-sm text-ink">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full cursor-pointer rounded-full bg-ink px-5 py-3 text-sm font-semibold text-sand shadow-soft transition hover:shadow-card disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-sm text-ink/60">
              New here?{" "}
              <Link to="/register" className="cursor-pointer font-semibold text-ink hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
