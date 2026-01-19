import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data || response);
        setRecentAppointments(response.data?.recentAppointments || response.recentAppointments || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    pageHeader: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    pageHeaderDesktop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
    },
    pageTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#111827',
      margin: 0,
    },
    pageSubtitle: {
      color: '#6b7280',
      marginTop: '4px',
      fontSize: '14px',
    },
    primaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      background: 'linear-gradient(to right, #3b82f6, #2563eb)',
      color: 'white',
      fontWeight: '500',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
      textDecoration: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      textDecoration: 'none',
      transition: 'all 0.3s',
    },
    statCardContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      margin: 0,
    },
    statValue: {
      fontSize: '30px',
      fontWeight: '700',
      color: '#111827',
      marginTop: '8px',
    },
    statIconBlue: {
      background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)',
      padding: '12px',
      borderRadius: '12px',
      color: 'white',
      boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
    },
    statIconGreen: {
      background: 'linear-gradient(to bottom right, #10b981, #059669)',
      padding: '12px',
      borderRadius: '12px',
      color: 'white',
      boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)',
    },
    statIconPurple: {
      background: 'linear-gradient(to bottom right, #8b5cf6, #7c3aed)',
      padding: '12px',
      borderRadius: '12px',
      color: 'white',
      boxShadow: '0 4px 6px rgba(139, 92, 246, 0.3)',
    },
    statIconAmber: {
      background: 'linear-gradient(to bottom right, #f59e0b, #d97706)',
      padding: '12px',
      borderRadius: '12px',
      color: 'white',
      boxShadow: '0 4px 6px rgba(245, 158, 11, 0.3)',
    },
    statFooter: {
      marginTop: '16px',
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      color: '#6b7280',
    },
    statLink: {
      color: '#2563eb',
      fontWeight: '500',
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '24px',
    },
    contentGridLarge: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: '24px',
      borderBottom: '1px solid #f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      margin: 0,
    },
    cardLink: {
      fontSize: '14px',
      color: '#2563eb',
      fontWeight: '500',
      textDecoration: 'none',
    },
    cardBody: {
      padding: '24px',
    },
    appointmentList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    appointmentItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
    },
    appointmentAvatar: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: '18px',
    },
    appointmentInfo: {
      flex: 1,
      minWidth: 0,
    },
    appointmentName: {
      fontWeight: '500',
      color: '#111827',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      margin: 0,
    },
    appointmentDoctor: {
      fontSize: '14px',
      color: '#6b7280',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      margin: 0,
    },
    appointmentRight: {
      textAlign: 'right',
    },
    statusBadge: {
      display: 'inline-flex',
      padding: '4px 10px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '500',
    },
    statusPending: {
      backgroundColor: '#fef3c7',
      color: '#b45309',
    },
    statusCompleted: {
      backgroundColor: '#d1fae5',
      color: '#047857',
    },
    statusCancelled: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
    },
    appointmentDate: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '4px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 24px',
    },
    emptyIcon: {
      width: '64px',
      height: '64px',
      backgroundColor: '#f3f4f6',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
    },
    emptyTitle: {
      color: '#111827',
      fontWeight: '500',
      marginBottom: '4px',
    },
    emptyText: {
      color: '#6b7280',
      fontSize: '14px',
      marginBottom: '16px',
    },
    emptyLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#2563eb',
      fontWeight: '500',
      textDecoration: 'none',
    },
    quickActions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    quickActionItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      textDecoration: 'none',
      transition: 'all 0.2s',
    },
    quickActionIconBlue: {
      width: '40px',
      height: '40px',
      backgroundColor: '#dbeafe',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#2563eb',
    },
    quickActionIconGreen: {
      width: '40px',
      height: '40px',
      backgroundColor: '#d1fae5',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#059669',
    },
    quickActionIconPurple: {
      width: '40px',
      height: '40px',
      backgroundColor: '#ede9fe',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#7c3aed',
    },
    quickActionTitle: {
      fontWeight: '500',
      color: '#111827',
      margin: 0,
    },
    quickActionSubtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0,
    },
    statsSection: {
      padding: '24px',
      borderTop: '1px solid #f3f4f6',
    },
    statsSectionTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      marginBottom: '16px',
    },
    progressContainer: {
      marginBottom: '16px',
    },
    progressHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '8px',
    },
    progressLabel: {
      fontSize: '14px',
      color: '#4b5563',
    },
    progressValue: {
      fontSize: '14px',
      fontWeight: '500',
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#f3f4f6',
      borderRadius: '9999px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: '9999px',
      transition: 'width 0.5s',
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '384px',
    },
    loadingContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    },
    spinner: {
      width: '48px',
      height: '48px',
      border: '4px solid #3b82f6',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    loadingText: {
      color: '#6b7280',
      fontWeight: '500',
    },
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return styles.statusCompleted;
      case 'pending':
        return styles.statusPending;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return { backgroundColor: '#f3f4f6', color: '#4b5563' };
    }
  };

  const statCards = [
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      iconStyle: styles.statIconBlue,
      link: '/doctors',
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      iconStyle: styles.statIconGreen,
      link: '/patients',
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      iconStyle: styles.statIconPurple,
      link: '/appointments',
    },
    {
      title: 'Pending',
      value: stats.pendingAppointments,
      iconStyle: styles.statIconAmber,
      link: '/appointments',
    },
  ];

  const icons = {
    doctors: (
      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    patients: (
      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    appointments: (
      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    pending: (
      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    plus: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    arrow: (
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ),
    addUser: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  };

  const iconsList = [icons.doctors, icons.patients, icons.appointments, icons.pending];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.pageHeaderDesktop}>
        <div>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <p style={styles.pageSubtitle}>Welcome back! Here's what's happening today.</p>
        </div>
        <Link to="/appointments/new" style={styles.primaryButton}>
          {icons.plus}
          New Appointment
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link} style={styles.statCard}>
            <div style={styles.statCardContent}>
              <div>
                <p style={styles.statTitle}>{stat.title}</p>
                <p style={styles.statValue}>{stat.value}</p>
              </div>
              <div style={stat.iconStyle}>
                {iconsList[index]}
              </div>
            </div>
            <div style={styles.statFooter}>
              <span style={styles.statLink}>View details</span>
              {icons.arrow}
            </div>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div style={window.innerWidth >= 1024 ? styles.contentGridLarge : styles.contentGrid}>
        {/* Appointments Summary */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Recent Appointments</h2>
            <Link to="/appointments" style={styles.cardLink}>View all</Link>
          </div>
          <div style={styles.cardBody}>
            {recentAppointments.length > 0 ? (
              <div style={styles.appointmentList}>
                {recentAppointments.slice(0, 5).map((appointment, index) => (
                  <div key={index} style={styles.appointmentItem}>
                    <div style={styles.appointmentAvatar}>
                      {appointment.patient?.name?.charAt(0) || 'P'}
                    </div>
                    <div style={styles.appointmentInfo}>
                      <p style={styles.appointmentName}>
                        {appointment.patient?.name || 'Unknown Patient'}
                      </p>
                      <p style={styles.appointmentDoctor}>
                        Dr. {appointment.doctor?.name || 'Unknown'}
                      </p>
                    </div>
                    <div style={styles.appointmentRight}>
                      <span style={{ ...styles.statusBadge, ...getStatusStyle(appointment.status) }}>
                        {appointment.status}
                      </span>
                      <p style={styles.appointmentDate}>
                        {new Date(appointment.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <svg width="32" height="32" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 style={styles.emptyTitle}>No appointments yet</h3>
                <p style={styles.emptyText}>Get started by creating a new appointment</p>
                <Link to="/appointments/new" style={styles.emptyLink}>
                  {icons.plus}
                  Create appointment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Quick Actions</h2>
          </div>
          <div style={{ ...styles.cardBody, ...styles.quickActions }}>
            <Link to="/doctors/new" style={styles.quickActionItem}>
              <div style={styles.quickActionIconBlue}>
                {icons.addUser}
              </div>
              <div>
                <p style={styles.quickActionTitle}>Add Doctor</p>
                <p style={styles.quickActionSubtitle}>Register a new doctor</p>
              </div>
            </Link>

            <Link to="/patients/new" style={styles.quickActionItem}>
              <div style={styles.quickActionIconGreen}>
                {icons.addUser}
              </div>
              <div>
                <p style={styles.quickActionTitle}>Add Patient</p>
                <p style={styles.quickActionSubtitle}>Register a new patient</p>
              </div>
            </Link>

            <Link to="/appointments/new" style={styles.quickActionItem}>
              <div style={styles.quickActionIconPurple}>
                {icons.plus}
              </div>
              <div>
                <p style={styles.quickActionTitle}>New Appointment</p>
                <p style={styles.quickActionSubtitle}>Schedule an appointment</p>
              </div>
            </Link>
          </div>

          {/* Stats Overview */}
          <div style={styles.statsSection}>
            <h3 style={styles.statsSectionTitle}>Appointment Status</h3>
            
            <div style={styles.progressContainer}>
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>Completed</span>
                <span style={{ ...styles.progressValue, color: '#059669' }}>{stats.completedAppointments}</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  backgroundColor: '#10b981',
                  width: `${stats.totalAppointments ? (stats.completedAppointments / stats.totalAppointments) * 100 : 0}%`
                }}></div>
              </div>
            </div>

            <div style={styles.progressContainer}>
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>Pending</span>
                <span style={{ ...styles.progressValue, color: '#d97706' }}>{stats.pendingAppointments}</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  backgroundColor: '#f59e0b',
                  width: `${stats.totalAppointments ? (stats.pendingAppointments / stats.totalAppointments) * 100 : 0}%`
                }}></div>
              </div>
            </div>

            <div style={styles.progressContainer}>
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>Cancelled</span>
                <span style={{ ...styles.progressValue, color: '#dc2626' }}>{stats.cancelledAppointments}</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  backgroundColor: '#ef4444',
                  width: `${stats.totalAppointments ? (stats.cancelledAppointments / stats.totalAppointments) * 100 : 0}%`
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
