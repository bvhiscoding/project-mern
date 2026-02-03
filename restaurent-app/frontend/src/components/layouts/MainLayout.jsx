import Navbar from '../common/Navbar';
import { Toaster } from 'react-hot-toast';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen text-[#2b1e18] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#f3e0b8]/50 blur-3xl" />
        <div className="absolute top-40 -left-20 h-80 w-80 rounded-full bg-[#f2d6c2]/40 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#f7eadc]/50 blur-3xl" />
      </div>

      <div className="relative">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="pb-12">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default MainLayout;
