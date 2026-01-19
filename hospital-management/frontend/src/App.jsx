import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

//Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import DoctorList from "./pages/doctors/DoctorList";
import PatientList from "./pages/patients/PatientList";
import AppointmentList from "./pages/appointments/AppointmentList";
import DoctorForm from "./pages/doctors/DoctorForm";
import PatientForm from "./pages/patients/PatientForm";
import AppointmentForm from "./pages/appointments/AppointmentForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* PRIVATE ROUTES */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to={"/dashboard"} replace />}></Route>
          <Route path="dashboard" element={<Dashboard />}></Route>

          <Route path="doctors" element={<DoctorList />}></Route>
          <Route path="doctors/new" element={<DoctorForm />}></Route>
          <Route path="doctors/:id/edit" element={<DoctorForm />}></Route>
          <Route path="patients" element={<PatientList />}></Route>
          <Route path="patients/new" element={<PatientForm />}></Route>
          <Route path="patients/:id/edit" element={<PatientForm />}></Route>
          <Route path="appointments" element={<AppointmentList />}></Route>
          <Route path="appointments/new" element={<AppointmentForm />}></Route>
          <Route path="appointments/:id/edit" element={<AppointmentForm />}></Route>
        </Route>
        <Route path="*" element={<Navigate to='dashboard' replace/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App