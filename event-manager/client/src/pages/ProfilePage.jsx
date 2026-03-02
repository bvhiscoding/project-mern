import { useGetMeQuery } from "../api/api.slice";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/auth.slice";

const ProfilePage = () => {
  const dispatch = useDispatch();

  const { data: user, isLoading, isError } = useGetMeQuery();

  const handleLogout = () => {
    dispatch(logout());
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  if (isError) {
    return (
      <div className="text-center mt-10 text-red-500">Lỗi khi tải profile</div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Thông Tin Cá Nhân</h1>
      <div className="space-y-2">
        <p>
          <strong>Tên:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Vai trò:</strong> {user?.role}
        </p>
      </div>

      <button onClick={handleLogout} className="btn-danger mt-4">
        Đăng Xuất
      </button>
    </div>
  );
};

export default ProfilePage;
