import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../api/api.slice";
import { setCredentials } from "../store/slices/auth.slice";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [register, { isLoading, isError, error }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { name, email, password, confirmPassword } = formData;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user && token) {
      navigate("/");
    }
  }, [user, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("Mật khẩu không khớp");
    }
    try {
      const userData = await register({ name, email, password }).unwrap();
      dispatch(setCredentials(userData));
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-x-8 p-8 bg-white rounded-lg shadow">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center">Đăng ký</h2>
        {/* Error */}
        {isError && (
          <div className="text-red-500 text-center bg-red-50 p-2 rounded">
            {error?.data?.message || "Đăng ký thất bại"}
          </div>
        )}
        {/* Register Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* name */}
          <div>
            <label className="label">Tên người dùng</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              className="input-field"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="input-field"
              required
            />
          </div>
          {/* password */}
          <div>
            <label className="label">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="input-field"
              required
            />
          </div>
          {/* confirmPassword */}
          <div>
            <label className="label">Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              className="input-field"
              required
            />
          </div>
          {/* Register button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        {/* redirect login */}
        <p className="text-center">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-primary">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
