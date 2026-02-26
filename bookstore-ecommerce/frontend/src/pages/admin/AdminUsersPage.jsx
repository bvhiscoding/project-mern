import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import {
  fetchUsers,
  removeUser,
  toggleUserAdmin,
} from "../../redux/slices/userSlice";

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector(
    (state) => state.users || {}
  );

  const handleToggleAdmin = (userId) => {
    const user = users.find((entry) => entry._id === userId);
    if (!user) {
      return;
    }
    dispatch(toggleUserAdmin({ id: userId, isAdmin: !user.isAdmin }));
  };

  const handleRemoveUser = (userId) => {
    dispatch(removeUser(userId));
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-sand text-ink">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Admin</p>
        <h1 className="mt-3 text-3xl font-display text-ink">Manage users</h1>

        <div className="mt-8 overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-soft">
          <div className="grid grid-cols-[1.5fr_1.5fr_1fr_140px] gap-4 border-b border-ink/10 px-6 py-4 text-xs uppercase tracking-[0.2em] text-ink/50">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Actions</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader label="Loading users…" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-ink/40">
              <FontAwesomeIcon icon={faUsers} className="text-4xl" />
              <p className="text-sm">No users found.</p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-[1.5fr_1.5fr_1fr_140px] items-center gap-4 border-b border-ink/5 px-6 py-4 text-sm hover:bg-clay/10 transition"
              >
                <span className="font-semibold text-ink">{user.name}</span>
                <span className="text-ink/60">{user.email}</span>
                <span
                  className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-semibold ${
                    user.isAdmin
                      ? "bg-pine/10 text-pine"
                      : "bg-ink/10 text-ink/60"
                  }`}
                >
                  {user.isAdmin ? "Admin" : "Customer"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleAdmin(user._id)}
                    className="cursor-pointer rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink/70 hover:border-ink/40 hover:bg-clay/20 transition"
                  >
                    Toggle admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user._id)}
                    className="cursor-pointer rounded-full border border-ember/30 px-3 py-1 text-xs font-semibold text-ember hover:bg-ember/10 hover:border-ember/60 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-ember/20 bg-ember/10 px-4 py-3 text-sm text-ink">
            {error}
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default AdminUsersPage;
