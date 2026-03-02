import { Navigate, Outlet } from "react-router-dom";

import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  return user && token ? <Outlet /> : <Navigate to="/login" replace />;
};


export default PrivateRoute
