import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute() {
  const { user, token } = useSelector((state) => state.auth);

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
