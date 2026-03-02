import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../api/api.slice";
import { setCredentials } from "../store/slices/auth.slice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading, isError, error }] = useLoginMutation();

  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const { email, password } = formData;

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
    if (!email || !password) {
      return;
    }
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials(userData));

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        {/* header */}
        <h2 className="text-3xl font-bold text-center">Đăng nhập</h2>
        {/* error message */}
        {isError && (
          <div className="text-red-500 text-center bg-red-50 p-2 rounded">
            {error?.data?.message || "Đăng nhập thất bại"}
          </div>
        )}
        {/* Login form */}
        <form onSubmit={onSubmit} className="space-y-4">
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
          {/* Password */}
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

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isLoading ? "Đang đăng nhập" : "Đăng nhập"}
          </button>
        </form>
        {/* Link to register */}
        <p className="text-center">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
