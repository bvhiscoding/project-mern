import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'home' },
    { name: 'Doctors', href: '/doctors', icon: 'doctor' },
    { name: 'Patients', href: '/patients', icon: 'patient' },
    { name: 'Appointments', href: '/appointments', icon: 'calendar' },
  ];

  const Icon = ({ name, size = 20 }) => {
    const style = { width: size, height: size, flexShrink: 0 };
    switch (name) {
      case 'home':
        return <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
      case 'doctor':
        return <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'patient':
        return <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
      case 'calendar':
        return <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
      case 'menu':
        return <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
      case 'close':
        return <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
      case 'logout':
        return <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
      case 'search':
        return <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
      case 'hospital':
        return <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
      default:
        return null;
    }
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 40,
    },
    mobileSidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: 280,
      backgroundColor: 'white',
      zIndex: 50,
      boxShadow: '2px 0 20px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
    },
    desktopSidebar: {
      width: 280,
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 30,
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '16px 20px',
      borderBottom: '1px solid #e5e7eb',
    },
    logoIcon: {
      width: 40,
      height: 40,
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    },
    logoText: {
      fontSize: 20,
      fontWeight: 700,
      background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    nav: {
      flex: 1,
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    navItem: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      borderRadius: 10,
      textDecoration: 'none',
      fontSize: 14,
      fontWeight: 500,
      background: isActive ? 'linear-gradient(90deg, #3b82f6, #2563eb)' : 'transparent',
      color: isActive ? 'white' : '#4b5563',
      boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
      transition: 'all 0.2s ease',
    }),
    userSection: {
      padding: 16,
      borderTop: '1px solid #e5e7eb',
    },
    userCard: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      backgroundColor: '#f9fafb',
      borderRadius: 10,
    },
    userAvatar: {
      width: 40,
      height: 40,
      background: 'linear-gradient(135deg, #374151, #1f2937)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 600,
      fontSize: 16,
    },
    userName: {
      fontSize: 14,
      fontWeight: 500,
      color: '#111827',
      margin: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    userEmail: {
      fontSize: 12,
      color: '#6b7280',
      margin: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    main: {
      flex: 1,
      marginLeft: 280,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 20,
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      height: 64,
    },
    searchWrapper: {
      flex: 1,
      maxWidth: 400,
      margin: '0 16px',
      position: 'relative',
    },
    searchIcon: {
      position: 'absolute',
      left: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
    },
    searchInput: {
      width: '100%',
      padding: '10px 16px 10px 44px',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      fontSize: 14,
      backgroundColor: '#f9fafb',
      outline: 'none',
    },
    logoutBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
      fontSize: 14,
      fontWeight: 500,
      color: '#374151',
      backgroundColor: '#f3f4f6',
      border: 'none',
      borderRadius: 10,
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    content: {
      flex: 1,
      padding: 24,
    },
    menuBtn: {
      display: 'none',
      padding: 8,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      borderRadius: 8,
    },
  };

  return (
    <>
      <style>{`
        @media (max-width: 1024px) {
          .desktop-sidebar { display: none !important; }
          .main-content { margin-left: 0 !important; }
          .menu-btn { display: block !important; }
          .search-wrapper { display: none !important; }
        }
      `}</style>
      
      <div style={styles.container}>
        {/* Mobile overlay */}
        {sidebarOpen && <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />}

        {/* Mobile Sidebar */}
        <div style={{ ...styles.mobileSidebar, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
          <div style={{ ...styles.logo, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={styles.logoIcon}><Icon name="hospital" size={24} /></div>
              <span style={styles.logoText}>MediCare</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} style={{ padding: 8, border: 'none', background: 'none', cursor: 'pointer' }}>
              <Icon name="close" />
            </button>
          </div>
          <nav style={styles.nav}>
            {navigation.map((item) => (
              <NavLink key={item.name} to={item.href} onClick={() => setSidebarOpen(false)}
                style={({ isActive }) => styles.navItem(isActive)}>
                <Icon name={item.icon} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Desktop Sidebar */}
        <div className="desktop-sidebar" style={styles.desktopSidebar}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}><Icon name="hospital" size={24} /></div>
            <span style={styles.logoText}>MediCare</span>
          </div>
          <nav style={styles.nav}>
            {navigation.map((item) => (
              <NavLink key={item.name} to={item.href}
                style={({ isActive }) => styles.navItem(isActive)}>
                <Icon name={item.icon} />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div style={styles.userSection}>
            <div style={styles.userCard}>
              <div style={styles.userAvatar}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={styles.userName}>{user?.name || 'User'}</p>
                <p style={styles.userEmail}>{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content" style={styles.main}>
          <header style={styles.header}>
            <div style={styles.headerContent}>
              <button className="menu-btn" style={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
                <Icon name="menu" size={24} />
              </button>
              <div className="search-wrapper" style={styles.searchWrapper}>
                <span style={styles.searchIcon}><Icon name="search" /></span>
                <input type="text" placeholder="Search..." style={styles.searchInput} />
              </div>
              <button style={styles.logoutBtn} onClick={handleLogout}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}>
                <Icon name="logout" />
                <span>Logout</span>
              </button>
            </div>
          </header>
          <main style={styles.content}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
