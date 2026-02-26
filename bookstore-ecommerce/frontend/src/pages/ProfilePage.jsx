import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { demoUser } from "../data/demoData";
import { getUserProfile, updateProfile } from "../redux/slices/authSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth || {});
  const profile = user || demoUser;

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const [formDraft, setFormDraft] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const formData = {
    name: formDraft.name || profile.name,
    email: formDraft.email || profile.email,
    password: formDraft.password,
    confirmPassword: formDraft.confirmPassword,
  };
  const [message, setMessage] = useState("");
  const isError = message === "Passwords do not match.";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    dispatch(updateProfile(formData))
      .unwrap()
      .then(() => setMessage("Profile updated successfully."))
      .catch(() => undefined);
  };

  useEffect(() => {
    if (user?.token) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user?.token]);

  return (
    <div className="min-h-screen bg-sand text-ink">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Avatar + page heading */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-clay text-lg font-display font-semibold text-ink select-none">
            {initials}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Profile</p>
            <h1 className="mt-0.5 text-3xl font-display text-ink">Account settings</h1>
          </div>
        </div>

        <p className="mt-3 text-sm text-ink/60">
          Update your details and change your password.
        </p>
        <Link
          to="/orders"
          className="mt-1 inline-flex items-center gap-1 text-sm text-pine underline-offset-2 hover:underline cursor-pointer"
        >
          View your order history →
        </Link>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-display text-ink">Profile details</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink shadow-sm focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink shadow-sm focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-display text-ink">Security</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New password"
                className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink shadow-sm focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20"
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink shadow-sm focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20"
              />
            </div>
          </div>

          {message ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm text-ink ${
                isError
                  ? "border-ember/20 bg-ember/10"
                  : "border-pine/20 bg-pine/10"
              }`}
            >
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-ember/20 bg-ember/10 px-4 py-3 text-sm text-ink">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer rounded-full bg-ink px-6 py-3 text-sm font-semibold text-sand shadow-soft transition hover:bg-ink/90 hover:shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update profile"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
