import { NavLink } from 'react-router-dom';
import { FaChartLine, FaUtensils, FaHamburger, FaClipboardList, FaUsers } from 'react-icons/fa';

const links = [
  { to: '/admin', label: 'Overview', icon: FaChartLine },
  { to: '/admin/restaurants', label: 'Restaurants', icon: FaUtensils },
  { to: '/admin/dishes', label: 'Dishes', icon: FaHamburger },
  { to: '/admin/orders', label: 'Orders', icon: FaClipboardList },
  { to: '/admin/users', label: 'Users', icon: FaUsers },
];

const AdminSidebar = () => {
  return (
    <aside className="bg-white/90 border border-[#eadfce] rounded-3xl p-6 shadow-sm h-fit lg:sticky lg:top-24">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-[#8f3721] font-semibold">Admin</p>
        <h2 className="text-2xl font-bold text-[#2b1e18] mt-2">Control Room</h2>
        <p className="text-sm text-[#6d5b51] mt-1">Manage menus, orders, and staff.</p>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#b1452a] text-white shadow-sm'
                    : 'text-[#3c2f2a] hover:text-[#8f3721] hover:bg-[#fff4e6]'
                }`
              }
            >
              <Icon className="text-base" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
