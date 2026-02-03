import { Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminSidebar from './AdminSidebar';

const AdminShell = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <AdminSidebar />
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminShell;
