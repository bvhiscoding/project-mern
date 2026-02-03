import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import userService from '../../services/userService';

const initialForm = {
  name: '',
  email: '',
  role: 'user',
  phone: '',
  address: '',
};

const AdminUsersPage = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleEdit = (selected) => {
    setEditingId(selected._id);
    setFormData({
      name: selected.name || '',
      email: selected.email || '',
      role: selected.role || 'user',
      phone: selected.phone || '',
      address: selected.address || '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editingId) return;
    try {
      const response = await userService.updateUser(editingId, formData);
      const updated = response.data;
      setUsers((prev) => prev.map((item) => (item._id === editingId ? { ...item, ...updated } : item)));
      toast.success('User updated');
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    if (currentUser?._id === id) {
      toast.error('You cannot delete your own account');
      return;
    }
    if (!window.confirm('Delete this user?')) return;
    try {
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((item) => item._id !== id));
      toast.success('User deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/90 border border-[#eadfce] rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8f3721] font-semibold">Users</p>
            <h1 className="text-2xl font-bold text-[#2b1e18] mt-2">Manage Team & Customers</h1>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#eadfce] text-sm font-semibold text-[#3c2f2a] hover:bg-[#fff4e6]"
            >
              <FaTimes /> Cancel edit
            </button>
          )}
        </div>

        {editingId && (
          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#5a463d] mb-2">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#5a463d] mb-2">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#5a463d] mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#5a463d] mb-2">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#5a463d] mb-2">Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#eadfce] bg-white/80 focus:ring-2 focus:ring-[#d4a373]"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#b1452a] text-white font-semibold hover:bg-[#8f3721]"
              >
                Save changes
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white/90 border border-[#eadfce] rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#2b1e18] mb-4">All Users</h2>
        {isLoading ? (
          <p className="text-sm text-[#6d5b51]">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-[#6d5b51]">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6d5b51]">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Phone</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item._id} className="border-t border-[#eadfce]">
                    <td className="py-3 font-semibold text-[#2b1e18]">{item.name}</td>
                    <td className="py-3 text-[#5a463d]">{item.email}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.role === 'admin' ? 'bg-[#fff4e6] text-[#8f3721]' : 'bg-[#e9f3ea] text-[#3f6a4e]'}`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="py-3 text-[#5a463d]">{item.phone || '—'}</td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#eadfce] text-xs font-semibold text-[#3c2f2a] hover:bg-[#fff4e6]"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#f1d6c7] text-xs font-semibold text-[#8f3721] hover:bg-[#fff4e6]"
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
